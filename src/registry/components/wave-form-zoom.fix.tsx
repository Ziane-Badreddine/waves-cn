"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type CSSProperties,
} from "react";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWavesurfer } from "@/components/cors/wavesurfer-player";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WaveformZoomProps = {
  url: string;

  // ── Waveform ───────────────────────────────────────────────────────────────
  waveColor?: string;
  progressColor?: string;
  waveformHeight?: number;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;

  // ── Zoom plugin ───────────────────────────────────────────────────────────
  zoomScale?: number; // default: 0.5 — magnification per scroll step
  maxZoom?: number; // default: 1000 — max px/s
  defaultZoom?: number; // default: 100 — initial minPxPerSec

  // ── Behaviour ─────────────────────────────────────────────────────────────
  skipSeconds?: number; // default: 5

  // ── Style ─────────────────────────────────────────────────────────────────
  className?: string;
  style?: CSSProperties;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function WaveformZoom({
  url,
  waveColor = "var(--primary)",
  progressColor = "var(--primary/50)",
  waveformHeight = 80,
  barWidth,
  barGap,
  barRadius,
  zoomScale = 0.5,
  maxZoom = 1000,
  defaultZoom = 100,
  skipSeconds = 5,
  className,
  style,
}: WaveformZoomProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentZoom, setCurrentZoom] = useState(defaultZoom);
  const [autoScroll, setAutoScroll] = useState(true);
  const [fillParent, setFillParent] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);

  // ── Stable plugins array ──────────────────────────────────────────────────
  const plugins = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── Hook ──────────────────────────────────────────────────────────────────
  const { wavesurfer, isReady, isPlaying } = useWavesurfer({
    container: containerRef,
    url,
    waveColor,
    progressColor,
    height: waveformHeight,
    barWidth,
    barGap,
    barRadius,
    minPxPerSec: defaultZoom,
    dragToSeek: true,
    autoScroll,
    fillParent,
    autoCenter,
    plugins,
  });

  // ── Track zoom level from plugin ──────────────────────────────────────────
  // The ZoomPlugin hardcodes canvas height to 100px internally and rewrites it
  // AFTER the zoom event fires — so setOptions and rAF canvas patching both
  // lose the race. The reliable fix is to constrain the wavesurfer wrapper
  // element via CSS so any canvas overflow is simply clipped.
  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.registerPlugin(
      ZoomPlugin.create({
        scale: zoomScale,
        maxZoom,
      }),
    );

    const pinWrapperHeight = () => {
      const wrapper = wavesurfer
        .getRenderer()
        .getWrapper() as HTMLElement | null;
      if (wrapper) {
        wrapper.style.height = `${waveformHeight}px`;
        wrapper.style.overflow = "hidden";
      }
    };

    // Pin once on mount
    pinWrapperHeight();

    const unsub = wavesurfer.on("zoom", (minPxPerSec) => {
      setCurrentZoom(Math.round(minPxPerSec));
      // Re-pin after each zoom tick — plugin may reset wrapper styles
      requestAnimationFrame(pinWrapperHeight);
    });

    return () => unsub();
  }, [wavesurfer, waveformHeight]);

  // ── Options sync ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!wavesurfer || !isReady) return;
    wavesurfer.setOptions({ autoScroll, fillParent, autoCenter });
  }, [wavesurfer, isReady, autoScroll, fillParent, autoCenter]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => wavesurfer?.playPause(), [wavesurfer]);
  const forward = useCallback(
    () => wavesurfer?.skip(skipSeconds),
    [wavesurfer, skipSeconds],
  );
  const backward = useCallback(
    () => wavesurfer?.skip(-skipSeconds),
    [wavesurfer, skipSeconds],
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full space-y-4", className)} style={style}>
      {/* Zoom indicator */}
      <p className="text-xs text-muted-foreground">
        Zoom:{" "}
        <span className="tabular-nums font-medium text-foreground">
          {currentZoom}
        </span>{" "}
        px/s
        <span className="ml-2 opacity-60">— scroll to zoom</span>
      </p>

      {/* Waveform */}
      <div
        ref={containerRef}
        className="w-full rounded-md overflow-hidden bg-muted/40"
        style={{ height: waveformHeight }}
      />

      {/* Toggles */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {(
          [
            {
              label: "Auto scroll",
              value: autoScroll,
              onChange: setAutoScroll,
            },
            {
              label: "Fill parent",
              value: fillParent,
              onChange: setFillParent,
            },
            {
              label: "Auto center",
              value: autoCenter,
              onChange: setAutoCenter,
            },
          ] as const
        ).map(({ label, value, onChange }) => (
          <div key={label} className="flex items-center gap-2">
            <Switch
              id={label}
              checked={value}
              onCheckedChange={onChange}
              disabled={!isReady}
            />
            <Label
              htmlFor={label}
              className="text-sm text-muted-foreground cursor-pointer"
            >
              {label}
            </Label>
          </div>
        ))}
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={backward}
          disabled={!isReady}
          aria-label={`Backward ${skipSeconds}s`}
        >
          <SkipBack className="size-4" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlay}
          disabled={!isReady}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={forward}
          disabled={!isReady}
          aria-label={`Forward ${skipSeconds}s`}
        >
          <SkipForward className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default WaveformZoom;
