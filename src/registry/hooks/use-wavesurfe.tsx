"use client";

/**
 * A React component for wavesurfer.js
 *
 * Usage:
 *
 * import WavesurferPlayer from '@wavesurfer/react'
 *
 * <WavesurferPlayer
 *   url="/my-server/audio.ogg"
 *   waveColor="purple"
 *   height={100}
 *   onReady={(wavesurfer) => console.log('Ready!', wavesurfer)}
 * />
 */

import {
  useState,
  useMemo,
  useEffect,
  useRef,
  memo,
  type ReactElement,
  type RefObject,
} from "react";
import WaveSurfer, {
  type WaveSurferEvents,
  type WaveSurferOptions,
} from "wavesurfer.js";

type WavesurferEventHandler<T extends unknown[]> = (
  wavesurfer: WaveSurfer,
  ...args: T
) => void;

type OnWavesurferEvents = {
  [K in keyof WaveSurferEvents as `on${Capitalize<K>}`]?: WavesurferEventHandler<
    WaveSurferEvents[K]
  >;
};

type PartialWavesurferOptions = Omit<WaveSurferOptions, "container">;

/**
 * Props for the Wavesurfer component
 * @public
 */
export type WavesurferProps = PartialWavesurferOptions & OnWavesurferEvents;

/**
 * Shared waveform defaults applied to every useWavesurfer instance.
 * Override any of these by passing the corresponding option explicitly.
 */
export const WAVESURFER_DEFAULTS = {
  waveColor: "var(--muted-foreground)",
  progressColor: "var(--primary)",
  height: 64,
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  minPxPerSec: 1,
} as const satisfies Partial<WaveSurferOptions>;

/**
 * Use wavesurfer instance
 */
function useWavesurferInstance(
  containerRef: RefObject<HTMLDivElement | null>,
  options: Partial<WaveSurferOptions>,
): WaveSurfer | null {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  // Flatten options object to an array of keys and values to compare them deeply in the hook deps
  // Exclude plugins from deep comparison since they are mutated during initialization
  const optionsWithoutPlugins = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plugins, ...rest } = options;
    return rest;
  }, [options]);
  const flatOptions = useMemo(
    () => Object.entries(optionsWithoutPlugins).flat(),
    [optionsWithoutPlugins],
  );

  // Create a wavesurfer instance
  useEffect(() => {
    if (!containerRef?.current) return;

    const ws = WaveSurfer.create({
      ...optionsWithoutPlugins,
      plugins: options.plugins,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
    // Only recreate if plugins array reference changes (not on mutation)
    // Users should memoize the plugins array to prevent unnecessary re-creation
  }, [containerRef, options.plugins, ...flatOptions]);

  return wavesurfer;
}

/**
 * Use wavesurfer state
 */
function useWavesurferState(wavesurfer: WaveSurfer | null): {
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
} {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    if (!wavesurfer) return;

    const unsubscribeFns = [
      wavesurfer.on("load", () => {
        setIsReady(false);
        setIsPlaying(false);
        setCurrentTime(0);
      }),

      wavesurfer.on("ready", () => {
        setIsReady(true);
        setIsPlaying(false);
        setHasFinished(false);
        setCurrentTime(0);
      }),

      wavesurfer.on("finish", () => {
        setHasFinished(true);
      }),

      wavesurfer.on("play", () => {
        setIsPlaying(true);
      }),

      wavesurfer.on("pause", () => {
        setIsPlaying(false);
      }),

      wavesurfer.on("timeupdate", () => {
        setCurrentTime(wavesurfer.getCurrentTime());
      }),

      wavesurfer.on("destroy", () => {
        setIsReady(false);
        setIsPlaying(false);
      }),
    ];

    return () => {
      unsubscribeFns.forEach((fn) => fn());
    };
  }, [wavesurfer]);

  return useMemo(
    () => ({
      isReady,
      isPlaying,
      hasFinished,
      currentTime,
    }),
    [isPlaying, hasFinished, currentTime, isReady],
  );
}

const EVENT_PROP_RE = /^on([A-Z])/;
const isEventProp = (key: string) => EVENT_PROP_RE.test(key);
const getEventName = (key: string) =>
  key.replace(EVENT_PROP_RE, (_, $1) =>
    $1.toLowerCase(),
  ) as keyof WaveSurferEvents;

/**
 * Parse props into wavesurfer options and events
 */
function useWavesurferProps(
  props: WavesurferProps,
): [PartialWavesurferOptions, OnWavesurferEvents] {
  // Props starting with `on` are wavesurfer events, e.g. `onReady`
  // The rest of the props are wavesurfer options
  return useMemo<[PartialWavesurferOptions, OnWavesurferEvents]>(() => {
    const allOptions = { ...props };
    const allEvents = { ...props };

    for (const key in allOptions) {
      if (isEventProp(key)) {
        delete allOptions[key as keyof WavesurferProps];
      } else {
        delete allEvents[key as keyof WavesurferProps];
      }
    }
    return [allOptions, allEvents];
  }, [props]);
}

/**
 * Subscribe to wavesurfer events
 */
function useWavesurferEvents(
  wavesurfer: WaveSurfer | null,
  events: OnWavesurferEvents,
) {
  const flatEvents = useMemo(() => Object.entries(events).flat(), [events]);

  // Subscribe to events
  useEffect(() => {
    if (!wavesurfer) return;

    const eventEntries = Object.entries(events);
    if (!eventEntries.length) return;

    const unsubscribeFns = eventEntries.map(([name, handler]) => {
      const event = getEventName(name);
      return wavesurfer.on(event, (...args) =>
        (handler as WavesurferEventHandler<WaveSurferEvents[typeof event]>)(
          wavesurfer,
          ...args,
        ),
      );
    });

    return () => {
      unsubscribeFns.forEach((fn) => fn());
    };
  }, [wavesurfer, ...flatEvents]);
}

/**
 * Wavesurfer player component
 * @see https://wavesurfer.xyz/docs/modules/wavesurfer
 * @public
 */
const WavesurferPlayer = memo((props: WavesurferProps): ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [options, events] = useWavesurferProps(props);
  const wavesurfer = useWavesurferInstance(containerRef, options);
  useWavesurferEvents(wavesurfer, events);

  // Create a container div
  return <div ref={containerRef} />;
});

/**
 * @public
 */
export default WavesurferPlayer;

/**
 * React hook for wavesurfer.js
 *
 * Automatically applies shared defaults (colors, height, bar shape, volume).
 * Any option passed explicitly will override the defaults.
 * CSS var() tokens in waveColor and progressColor are resolved at runtime
 * so they work correctly with the Canvas API.
 *
 * ```
 * import { useWavesurfer } from '@/components/cors/wavesurfer-player'
 *
 * const App = () => {
 *   const containerRef = useRef<HTMLDivElement | null>(null)
 *
 *   const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
 *     container: containerRef,
 *     url: '/my-server/audio.ogg',
 *   })
 *
 *   return <div ref={containerRef} />
 * }
 * ```
 *
 * @public
 */
export function useWavesurfer({
  container,
  waveColor = WAVESURFER_DEFAULTS.waveColor,
  progressColor = WAVESURFER_DEFAULTS.progressColor,
  ...options
}: Omit<WaveSurferOptions, "container"> & {
  container: RefObject<HTMLDivElement | null>;
}): ReturnType<typeof useWavesurferState> & {
  wavesurfer: ReturnType<typeof useWavesurferInstance>;
} {
  // Resolve CSS var() tokens so the Canvas API receives actual color values
  const resolvedWaveColor = useCssVar(waveColor as string);
  const resolvedProgressColor = useCssVar(progressColor as string);

  // Memoize mergedOptions so useWavesurferInstance gets a stable object reference.
  // Without this, a new object is created every render → flatOptions changes →
  // the instance is destroyed and recreated on every render, wiping spread props.
  // Also strip undefined values so they don't silently override WAVESURFER_DEFAULTS.
  const mergedOptions = useMemo(() => {
    const cleanOptions = Object.fromEntries(
      Object.entries(options).filter(([, v]) => v !== undefined),
    ) as Partial<WaveSurferOptions>;

    return {
      ...WAVESURFER_DEFAULTS,
      ...cleanOptions,
      waveColor: resolvedWaveColor,
      progressColor: resolvedProgressColor,
    } as Partial<WaveSurferOptions>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedWaveColor, resolvedProgressColor, ...Object.values(options)]);

  const wavesurfer = useWavesurferInstance(container, mergedOptions);
  const state = useWavesurferState(wavesurfer);
  return useMemo(() => ({ ...state, wavesurfer }), [state, wavesurfer]);
}

export function useCssVar(value: string): string {
  const [resolved, setResolved] = useState(value);

  useEffect(() => {
    // Only resolve if the value looks like a CSS variable
    const match = value.match(/^var\((--[^)]+)\)$/);
    if (!match) {
      setResolved(value);
      return;
    }
    const varName = match[1];
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    // shadcn stores values as bare HSL channels e.g. "222.2 47.4% 11.2%"
    // Canvas needs a full color string — wrap in hsl() if needed
    const isHslChannels = /^[\d.]+ [\d.]+% [\d.]+%$/.test(raw);
    setResolved(raw ? (isHslChannels ? `hsl(${raw})` : raw) : value);
  }, [value]);

  return resolved;
}
