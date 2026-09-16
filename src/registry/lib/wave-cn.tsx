"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  type ReactElement,
  type RefObject,
} from "react";
import WaveSurfer, {
  type WaveSurferEvents,
  type WaveSurferOptions,
} from "wavesurfer.js";

// ─── Types ───────────────────────────────────────────────────────────────────

type WavesurferEventHandler<T extends unknown[]> = (
  wavesurfer: WaveSurfer,
  ...args: T
) => void;

/** `onReady`, `onPlay`, `onTimeupdate`, … — one prop per wavesurfer.js event. */
export type OnWavesurferEvents = {
  [K in keyof WaveSurferEvents as `on${Capitalize<K>}`]?: WavesurferEventHandler<
    WaveSurferEvents[K]
  >;
};

export type PartialWavesurferOptions = Omit<WaveSurferOptions, "container">;
type WavesurferPlugin = NonNullable<WaveSurferOptions["plugins"]>[number];

export type WavesurferProps = PartialWavesurferOptions &
  OnWavesurferEvents & {
    className?: string;
  };

// ─── Defaults ────────────────────────────────────────────────────────────────

export const WAVESURFER_DEFAULTS = {
  waveColor: "var(--muted-foreground)",
  progressColor: "var(--primary)",
  height: 64,
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  minPxPerSec: 1,
  cursorWidth: 0,
} as const satisfies Partial<WaveSurferOptions>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Formats seconds as `m:ss`. Negative or non-finite input renders as `0:00`. */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const EVENT_PROP_RE = /^on([A-Z])/;
const isEventProp = (key: string) => EVENT_PROP_RE.test(key);
const getEventName = (key: string) =>
  key.replace(EVENT_PROP_RE, (_, $1) =>
    $1.toLowerCase(),
  ) as keyof WaveSurferEvents;

/**
 * Options that require a brand-new WaveSurfer instance when they change.
 * Every other option is applied in place through `wavesurfer.setOptions()`,
 * so cosmetic changes (bar width, height, colors…) never re-fetch the audio.
 *
 * `plugins` and `peaks` are compared by reference: memoize them in the caller
 * (`useMemo`) or the player will be recreated on every render.
 */
const STRUCTURAL_KEYS = [
  "url",
  "media",
  "plugins",
  "peaks",
  "duration",
  "sampleRate",
  "backend",
  "mediaControls",
] as const satisfies readonly (keyof WaveSurferOptions)[];

type StructuralKey = (typeof STRUCTURAL_KEYS)[number];

function isStructuralKey(key: string): key is StructuralKey {
  return (STRUCTURAL_KEYS as readonly string[]).includes(key);
}

function splitProps(props: WavesurferProps) {
  const { className, ...rest } = props;
  const options: Partial<WaveSurferOptions> = {};
  const events: OnWavesurferEvents = {};
  for (const key in rest) {
    const value = rest[key as keyof typeof rest];
    if (isEventProp(key)) {
      events[key as keyof OnWavesurferEvents] = value as never;
    } else {
      options[key as keyof PartialWavesurferOptions] = value as never;
    }
  }
  return { className, options, events };
}

function pickUpdatableOptions(
  options: Partial<WaveSurferOptions>,
): Partial<WaveSurferOptions> {
  const out: Partial<WaveSurferOptions> = {};
  for (const key in options) {
    if (isStructuralKey(key)) continue;
    const value = options[key as keyof WaveSurferOptions];
    if (value === undefined) continue; // keep WAVESURFER_DEFAULTS in place
    out[key as keyof WaveSurferOptions] = value as never;
  }
  return out;
}

/**
 * Keys whose value changed between two option objects. Only those are sent to
 * `setOptions()`, so re-rendering with the same props never resets state that
 * the user changed through the instance (zoom level, playback rate…).
 */
function diffOptions(
  prev: Partial<WaveSurferOptions>,
  next: Partial<WaveSurferOptions>,
): Partial<WaveSurferOptions> {
  const patch: Partial<WaveSurferOptions> = {};
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const key of keys) {
    const k = key as keyof WaveSurferOptions;
    if (prev[k] !== next[k]) patch[k] = next[k] as never;
  }
  return patch;
}

/** Stable string for the updatable, serialisable part of the options. */
function updatableOptionsKey(options: Partial<WaveSurferOptions>): string {
  const out: Record<string, unknown> = {};
  for (const key in options) {
    if (isStructuralKey(key)) continue;
    const value = options[key as keyof WaveSurferOptions];
    if (typeof value === "function") continue;
    if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement)
      continue;
    out[key] = value;
  }
  return JSON.stringify(out);
}

/**
 * Plugins passed to `<WavesurferPlayer>` act as templates. wavesurfer.js destroys
 * plugins together with the instance, so a fresh copy is created from each
 * template every time the instance is (re)created.
 */
function instantiatePlugins(
  plugins: WaveSurferOptions["plugins"],
): WaveSurferOptions["plugins"] {
  return plugins?.map((plugin) => {
    const Plugin = plugin.constructor as new (
      options: unknown,
    ) => WavesurferPlugin;
    const options = (plugin as unknown as { options?: unknown }).options;
    return new Plugin(options);
  });
}

// ─── CSS var resolver ────────────────────────────────────────────────────────

const CSS_VAR_RE = /^var\((--[^,)]+)(?:\s*,\s*([^)]+))?\)$/;

function resolveCssVar(value: string): string {
  if (typeof window === "undefined") return value;
  const match = CSS_VAR_RE.exec(value.trim());
  if (!match) return value;

  const [, name, fallback] = match;
  const root = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const body = root
    ? ""
    : getComputedStyle(document.body).getPropertyValue(name).trim();
  const raw = root || body || fallback?.trim() || "";
  if (!raw) return value;

  // shadcn v3 stored bare HSL channels ("222.2 47.4% 11.2%"); canvas needs a full color.
  const isHslChannels = /^[\d.]+\s+[\d.]+%\s+[\d.]+%$/.test(raw);
  return isHslChannels ? `hsl(${raw})` : raw;
}

/**
 * Resolves a `var(--token)` string to its computed value so it can be handed to
 * a `<canvas>` (wavesurfer, minimap, spectrogram…). Re-resolves when the theme
 * class / `data-theme` attribute changes on `<html>` or `<body>`.
 *
 * Non-`var()` values pass straight through.
 */
export function useCssVar(value: string): string {
  const [resolved, setResolved] = useState(() => resolveCssVar(value));
  const [prevValue, setPrevValue] = useState(value);

  // Re-resolve synchronously when the input changes (derived state pattern).
  if (prevValue !== value) {
    setPrevValue(value);
    setResolved(resolveCssVar(value));
  }

  useEffect(() => {
    if (!CSS_VAR_RE.test(value.trim())) return;
    const update = () => setResolved(resolveCssVar(value));
    const observer = new MutationObserver(update);
    const config = {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    };
    observer.observe(document.documentElement, config);
    observer.observe(document.body, config);
    return () => observer.disconnect();
  }, [value]);

  return resolved;
}

// ─── <WavesurferPlayer> ──────────────────────────────────────────────────────

function WavesurferPlayerBase(props: WavesurferProps): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WaveSurfer | null>(null);
  const { className, options, events } = splitProps(props);

  // Colors: resolve CSS vars for the canvas, re-resolve on theme change.
  const waveColor =
    (options.waveColor as string | undefined) ?? WAVESURFER_DEFAULTS.waveColor;
  const progressColor =
    (options.progressColor as string | undefined) ??
    WAVESURFER_DEFAULTS.progressColor;
  const resolvedWaveColor = useCssVar(waveColor);
  const resolvedProgressColor = useCssVar(progressColor);

  // Latest props in refs so the creation effect never needs them as deps.
  const latest = useRef({ options, events, resolvedWaveColor, resolvedProgressColor });
  useEffect(() => {
    latest.current = { options, events, resolvedWaveColor, resolvedProgressColor };
  });

  const [isReady, setIsReady] = useState(false);
  /** Options last applied to the current instance (creation or setOptions). */
  const applied = useRef<Partial<WaveSurferOptions> | null>(null);

  const { url, media, plugins, peaks, duration, sampleRate, backend, mediaControls } =
    options;
  const height = options.height ?? WAVESURFER_DEFAULTS.height;

  // ── Create / destroy the instance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const current = latest.current;
    const initial = {
      ...pickUpdatableOptions(current.options),
      waveColor: current.resolvedWaveColor,
      progressColor: current.resolvedProgressColor,
    };
    const ws = WaveSurfer.create({
      ...WAVESURFER_DEFAULTS,
      ...initial,
      url,
      media,
      peaks,
      duration,
      sampleRate,
      backend,
      mediaControls,
      plugins: instantiatePlugins(plugins),
      container,
    });
    wsRef.current = ws;
    applied.current = initial;

    const unsubs: Array<() => void> = [
      ws.on("load", () => setIsReady(false)),
      ws.on("ready", () => setIsReady(true)),
      ws.on("destroy", () => setIsReady(false)),
    ];

    // Forward every `onX` prop present at mount to the matching wavesurfer event.
    // Handlers are read through the ref at call time, so parents can pass inline
    // functions without causing re-subscription.
    for (const name of Object.keys(current.events)) {
      const event = getEventName(name);
      unsubs.push(
        ws.on(event, (...args) => {
          const handler = latest.current.events[
            name as keyof OnWavesurferEvents
          ] as WavesurferEventHandler<WaveSurferEvents[typeof event]> | undefined;
          handler?.(ws, ...args);
        }),
      );
    }

    return () => {
      unsubs.forEach((fn) => fn());
      ws.destroy();
      wsRef.current = null;
      applied.current = null;
    };
  }, [url, media, plugins, peaks, duration, sampleRate, backend, mediaControls]);

  // ── Apply changed options in place (never the full set: see diffOptions)
  const optionsKey = updatableOptionsKey(options);
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws || !applied.current) return;
    const next = {
      ...pickUpdatableOptions(latest.current.options),
      waveColor: resolvedWaveColor,
      progressColor: resolvedProgressColor,
    };
    const patch = diffOptions(applied.current, next);
    applied.current = next;
    if (Object.keys(patch).length > 0) ws.setOptions(patch);
  }, [optionsKey, resolvedWaveColor, resolvedProgressColor]);

  return (
    <div className={className} style={{ position: "relative" }}>
      {!isReady && (
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse rounded bg-muted"
          style={{ height }}
        />
      )}
      <div ref={containerRef} style={isReady ? undefined : { opacity: 0 }} />
    </div>
  );
}

/**
 * Declarative wrapper around `WaveSurfer.create()`.
 *
 * - Every `WaveSurferOptions` key is accepted as a prop.
 * - Every wavesurfer event is available as `on<Event>` (`onReady`, `onTimeupdate`…).
 * - Changing `url`, `media`, `plugins`, `peaks`, `duration`, `sampleRate`,
 *   `backend` or `mediaControls` recreates the instance; anything else is applied
 *   through `setOptions()` without re-decoding.
 * - Memoize `plugins` and `peaks` (they are compared by reference).
 */
const WavesurferPlayer = memo(WavesurferPlayerBase, (prev, next) => {
  // Event handler identity never matters (read through a ref); everything else does.
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const key of keys) {
    if (isEventProp(key)) continue;
    if (prev[key as keyof WavesurferProps] !== next[key as keyof WavesurferProps])
      return false;
  }
  return true;
});
WavesurferPlayer.displayName = "WavesurferPlayer";

export default WavesurferPlayer;

// ─── useWavesurfer ───────────────────────────────────────────────────────────

/**
 * Imperative counterpart of `<WavesurferPlayer>`: you own the container element,
 * the hook owns the instance. Same recreate / setOptions rules apply.
 */
export function useWavesurfer({
  container,
  waveColor = WAVESURFER_DEFAULTS.waveColor,
  progressColor = WAVESURFER_DEFAULTS.progressColor,
  ...options
}: PartialWavesurferOptions & {
  container: RefObject<HTMLDivElement | null>;
}) {
  const resolvedWaveColor = useCssVar(waveColor as string);
  const resolvedProgressColor = useCssVar(progressColor as string);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const latest = useRef({ options, resolvedWaveColor, resolvedProgressColor });
  useEffect(() => {
    latest.current = { options, resolvedWaveColor, resolvedProgressColor };
  });
  const applied = useRef<Partial<WaveSurferOptions> | null>(null);

  const { url, media, plugins, peaks, duration, sampleRate, backend, mediaControls } =
    options;

  useEffect(() => {
    if (!container.current) return;
    const current = latest.current;
    const initial = {
      ...pickUpdatableOptions(current.options),
      waveColor: current.resolvedWaveColor,
      progressColor: current.resolvedProgressColor,
    };
    const ws = WaveSurfer.create({
      ...WAVESURFER_DEFAULTS,
      ...initial,
      url,
      media,
      peaks,
      duration,
      sampleRate,
      backend,
      mediaControls,
      plugins: instantiatePlugins(plugins),
      container: container.current,
    });
    applied.current = initial;

    const unsubs = [
      ws.on("load", () => {
        setIsReady(false);
        setIsPlaying(false);
        setCurrentTime(0);
      }),
      ws.on("ready", () => setIsReady(true)),
      ws.on("play", () => setIsPlaying(true)),
      ws.on("pause", () => setIsPlaying(false)),
      ws.on("finish", () => setIsPlaying(false)),
      ws.on("timeupdate", (t) => setCurrentTime(t)),
      ws.on("destroy", () => {
        setIsReady(false);
        setIsPlaying(false);
      }),
    ];
    setWavesurfer(ws);

    return () => {
      unsubs.forEach((fn) => fn());
      ws.destroy();
      applied.current = null;
      setWavesurfer(null);
    };
  }, [
    container,
    url,
    media,
    plugins,
    peaks,
    duration,
    sampleRate,
    backend,
    mediaControls,
  ]);

  const optionsKey = updatableOptionsKey(options);
  useEffect(() => {
    if (!wavesurfer || !applied.current) return;
    const next = {
      ...pickUpdatableOptions(latest.current.options),
      waveColor: resolvedWaveColor,
      progressColor: resolvedProgressColor,
    };
    const patch = diffOptions(applied.current, next);
    applied.current = next;
    if (Object.keys(patch).length > 0) wavesurfer.setOptions(patch);
  }, [wavesurfer, optionsKey, resolvedWaveColor, resolvedProgressColor]);

  return { wavesurfer, isReady, isPlaying, currentTime };
}

// ─── useWavePlayer ───────────────────────────────────────────────────────────

export interface UseWavePlayerOptions {
  /** Initial volume, 0–1 @default 1 */
  defaultVolume?: number;
  /** Start playback as soon as the audio is decoded */
  autoPlay?: boolean;
  /** Called once the audio is decoded, with the WaveSurfer instance */
  onReady?: (wavesurfer: WaveSurfer) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
  /** Called on every playback tick */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export type WavePlayerHandlers = Pick<
  OnWavesurferEvents,
  | "onReady"
  | "onPlay"
  | "onPause"
  | "onFinish"
  | "onTimeupdate"
  | "onSeeking"
  | "onDestroy"
>;

/**
 * Player state + controls shared by every waves-cn component.
 *
 * ```tsx
 * const player = useWavePlayer({ defaultVolume: 0.8, onPlay });
 * <WavesurferPlayer url={src} {...player.handlers} />
 * <Button onClick={player.togglePlay}>{player.isPlaying ? "Pause" : "Play"}</Button>
 * ```
 */
export function useWavePlayer(options: UseWavePlayerOptions = {}) {
  const { defaultVolume = 1 } = options;

  const wavesurfer = useRef<WaveSurfer | null>(null);
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const volumeRef = useRef(defaultVolume);

  const handlers = useMemo<WavePlayerHandlers>(
    () => ({
      onReady: (ws, dur) => {
        wavesurfer.current = ws;
        ws.setVolume(volumeRef.current);
        setDuration(dur);
        setCurrentTime(ws.getCurrentTime());
        setIsReady(true);
        if (latest.current.autoPlay) void ws.play();
        latest.current.onReady?.(ws);
      },
      onPlay: () => {
        setIsPlaying(true);
        latest.current.onPlay?.();
      },
      onPause: () => {
        setIsPlaying(false);
        latest.current.onPause?.();
      },
      onFinish: () => {
        setIsPlaying(false);
        latest.current.onFinish?.();
      },
      onTimeupdate: (ws, t) => {
        setCurrentTime(t);
        latest.current.onTimeUpdate?.(t, ws.getDuration());
      },
      onSeeking: (_ws, t) => setCurrentTime(t),
      onDestroy: () => {
        wavesurfer.current = null;
        setIsReady(false);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      },
    }),
    [],
  );

  const play = useCallback(() => void wavesurfer.current?.play(), []);
  const pause = useCallback(() => wavesurfer.current?.pause(), []);
  const togglePlay = useCallback(
    () => void wavesurfer.current?.playPause(),
    [],
  );
  const restart = useCallback(() => {
    const ws = wavesurfer.current;
    if (!ws) return;
    ws.setTime(0);
    void ws.play();
  }, []);
  /** Seek to a fraction of the duration (0–1). */
  const seek = useCallback((fraction: number) => {
    wavesurfer.current?.seekTo(Math.min(1, Math.max(0, fraction)));
  }, []);
  /** Seek to an absolute time in seconds. */
  const seekTo = useCallback((seconds: number) => {
    wavesurfer.current?.setTime(seconds);
  }, []);
  const setVolume = useCallback((next: number) => {
    const value = Math.min(1, Math.max(0, next));
    volumeRef.current = value;
    setVolumeState(value);
    setIsMuted(false);
    wavesurfer.current?.setMuted(false);
    wavesurfer.current?.setVolume(value);
  }, []);
  const toggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    wavesurfer.current?.setMuted(next);
  }, [isMuted]);

  const progress = duration > 0 ? currentTime / duration : 0;

  return {
    /** The live WaveSurfer instance (null until ready). */
    wavesurfer,
    isReady,
    isPlaying,
    currentTime,
    duration,
    /** currentTime / duration, 0–1 */
    progress,
    volume,
    isMuted,
    play,
    pause,
    togglePlay,
    restart,
    seek,
    seekTo,
    setVolume,
    toggleMute,
    /** Spread onto `<WavesurferPlayer>`: `<WavesurferPlayer {...player.handlers} />` */
    handlers,
  };
}
