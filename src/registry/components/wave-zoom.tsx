"use client";

import { useState, useEffect, useMemo, useId, type CSSProperties } from "react";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import WavesurferPlayer, { useWavePlayer } from "@/lib/wave-cn";

/**
 * Props for the WaveZoom component
 */
export type WaveZoomProps = {
  /** Audio source URL */
  src?: string;
  /** @deprecated use `src` */
  url?: string;
  /** Optional title shown above the waveform */
  title?: string;
  /** Wave bar color. Accepts any CSS value including var(--*) tokens @default "var(--muted-foreground)" */
  waveColor?: string;
  /** Progress bar color. Accepts any CSS value including var(--*) tokens @default "var(--primary)" */
  progressColor?: string;
  /** Wave canvas height in px @default 64 */
  waveHeight?: number;
  /** Bar width in px @default 3 */
  barWidth?: number;
  /** Gap between bars in px @default 2 */
  barGap?: number;
  /** Bar border radius in px @default 2 */
  barRadius?: number;
  /** Zoom magnification per scroll step @default 0.5 */
  zoomScale?: number;
  /** Maximum zoom level in px/s @default 1000 */
  maxZoom?: number;
  /** Initial zoom level in px/s @default 100 */
  defaultZoom?: number;
  /** Seconds to skip on forward/backward @default 5 */
  skipSeconds?: number;
  /** Called when playback starts */
  onPlay?: () => void;
  /** Called when playback pauses */
  onPause?: () => void;
  /** Called when playback finishes */
  onFinish?: () => void;
  /** Called with current time on every audio process tick */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** Root element class */
  className?: string;
  style?: CSSProperties;
};

/**
 * Wave player with mouse-wheel zoom via ZoomPlugin
 */
export function WaveZoom({
  src,
  url,
  title,
  waveColor,
  progressColor,
  waveHeight,
  barWidth,
  barGap,
  barRadius,
  zoomScale = 0.5,
  maxZoom = 1000,
  defaultZoom = 100,
  skipSeconds = 5,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
  style,
}: WaveZoomProps) {
  const source = src ?? url;

  // Apply the initial zoom once on ready rather than as a `minPxPerSec` prop:
  // the core re-applies every option prop through `setOptions()` when any of
  // them changes, which would reset the user's wheel-zoom on each toggle.
  const player = useWavePlayer({
    onReady: (ws) => ws.zoom(defaultZoom),
    onPlay,
    onPause,
    onFinish,
    onTimeUpdate,
  });
  const switchId = useId();

  const [currentZoom, setCurrentZoom] = useState(defaultZoom);
  const [autoScroll, setAutoScroll] = useState(true);
  const [fillParent, setFillParent] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);

  const plugins = useMemo(
    () =>
      typeof document === "undefined"
        ? []
        : [ZoomPlugin.create({ scale: zoomScale, maxZoom })],
    [zoomScale, maxZoom],
  );

  // Mirror the live zoom level; `ws.on` returns its own unsubscribe.
  useEffect(() => {
    const ws = player.wavesurfer.current;
    if (!player.isReady || !ws) return;
    return ws.on("zoom", (minPxPerSec) => {
      setCurrentZoom(Math.round(minPxPerSec));
    });
  }, [player.isReady, player.wavesurfer]);

  const forward = () => player.wavesurfer.current?.skip(skipSeconds);
  const backward = () => player.wavesurfer.current?.skip(-skipSeconds);

  const switches = [
    { label: "Auto scroll", value: autoScroll, onChange: setAutoScroll },
    { label: "Fill parent", value: fillParent, onChange: setFillParent },
    { label: "Auto center", value: autoCenter, onChange: setAutoCenter },
  ] as const;

  return (
    <div className={cn("w-full space-y-4", className)} style={style}>
      {title && (
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
      )}

      <p className="text-xs text-muted-foreground" aria-live="polite">
        Zoom:{" "}
        <span className="tabular-nums font-medium text-foreground">
          {currentZoom}
        </span>{" "}
        px/s
        <span className="ml-2 opacity-60">— scroll to zoom</span>
      </p>

      <div className="w-full rounded-md overflow-hidden bg-muted/40">
        <WavesurferPlayer
          url={source}
          waveColor={waveColor}
          progressColor={progressColor}
          height={waveHeight}
          barWidth={barWidth}
          barGap={barGap}
          barRadius={barRadius}
          dragToSeek
          autoScroll={autoScroll}
          fillParent={fillParent}
          autoCenter={autoCenter}
          plugins={plugins}
          {...player.handlers}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {switches.map(({ label, value, onChange }, index) => {
          const id = `${switchId}-${index}`;
          return (
            <div key={label} className="flex items-center gap-2">
              <Switch
                id={id}
                checked={value}
                onCheckedChange={onChange}
                disabled={!player.isReady}
              />
              <Label
                htmlFor={id}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {label}
              </Label>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={backward}
          disabled={!player.isReady}
          aria-label={`Backward ${skipSeconds}s`}
        >
          <SkipBack className="size-4" />
        </Button>

        <Button
          size="icon"
          onClick={player.togglePlay}
          disabled={!player.isReady}
          aria-label={player.isPlaying ? "Pause" : "Play"}
        >
          {player.isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={forward}
          disabled={!player.isReady}
          aria-label={`Forward ${skipSeconds}s`}
        >
          <SkipForward className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default WaveZoom;
