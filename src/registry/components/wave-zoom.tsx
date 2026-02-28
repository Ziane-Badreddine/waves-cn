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
import WavesurferPlayer from "@/lib/wave-cn";
import type WaveSurfer from "wavesurfer.js";

/**
 * Props for the WaveZoom component
 */
export type WaveZoomProps = {
  /** Wave file URL to load */
  url: string;
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
  /** Root element class */
  className?: string;
  style?: CSSProperties;
};

/**
 * Wave player with mouse-wheel zoom via ZoomPlugin
 */
export function WaveZoom({
  url,
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
  className,
  style,
}: WaveZoomProps) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveHeightRef = useRef(waveHeight ?? 64);
  waveHeightRef.current = waveHeight ?? 64;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(defaultZoom);
  const [autoScroll, setAutoScroll] = useState(true);
  const [fillParent, setFillParent] = useState(true);
  const [autoCenter, setAutoCenter] = useState(true);

  const plugins = useMemo(
    () => [ZoomPlugin.create({ scale: zoomScale, maxZoom })],
    [],
  );

  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !isReady) return;
    ws.setOptions({ autoScroll, fillParent, autoCenter });
  }, [isReady, autoScroll, fillParent, autoCenter]);

  const togglePlay = useCallback(() => wavesurferRef.current?.playPause(), []);
  const forward = useCallback(
    () => wavesurferRef.current?.skip(skipSeconds),
    [skipSeconds],
  );
  const backward = useCallback(
    () => wavesurferRef.current?.skip(-skipSeconds),
    [skipSeconds],
  );

  const handleReady = useCallback((ws: WaveSurfer) => {
    wavesurferRef.current = ws;
    setIsReady(true);

    ws.on("zoom", (minPxPerSec) => {
      setCurrentZoom(Math.round(minPxPerSec));
    });
  }, []);

  return (
    <div className={cn("w-full space-y-4", className)} style={style}>
      <p className="text-xs text-muted-foreground">
        Zoom:{" "}
        <span className="tabular-nums font-medium text-foreground">
          {currentZoom}
        </span>{" "}
        px/s
        <span className="ml-2 opacity-60">— scroll to zoom</span>
      </p>

      <div className="w-full rounded-md overflow-hidden bg-muted/40">
        <WavesurferPlayer
          url={url}
          waveColor={waveColor}
          progressColor={progressColor}
          height={waveHeight}
          barWidth={barWidth}
          barGap={barGap}
          barRadius={barRadius}
          minPxPerSec={defaultZoom}
          dragToSeek
          autoScroll={autoScroll}
          fillParent={fillParent}
          autoCenter={autoCenter}
          plugins={plugins}
          onReady={handleReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onFinish={() => setIsPlaying(false)}
          onDestroy={() => {
            wavesurferRef.current = null;
            setIsReady(false);
          }}
        />
      </div>

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

export default WaveZoom;
