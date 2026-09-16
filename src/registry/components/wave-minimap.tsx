"use client";

import * as React from "react";
import MinimapPlugin from "wavesurfer.js/dist/plugins/minimap.esm.js";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import WavesurferPlayer, {
  formatTime,
  useCssVar,
  useWavePlayer,
} from "@/lib/wave-cn";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WaveMinimapProps {
  /** Audio source URL */
  src: string;
  /** Optional title shown above the waveform */
  title?: string;
  /** Initial volume (0–1) */
  defaultVolume?: number;
  /** Minimap height in px @default 30 */
  minimapHeight?: number;
  /** Minimap wave color @default "var(--muted-foreground)" */
  minimapWaveColor?: string;
  /** Minimap progress color @default "var(--primary)" */
  minimapProgressColor?: string;
  /** Minimap overlay (viewport indicator) color @default "color-mix(in oklab, var(--primary) 15%, transparent)" */
  overlayColor?: string;
  /** Default zoom level in px/s @default 100 */
  defaultZoom?: number;
  /** Minimum zoom level @default 10 */
  minZoom?: number;
  /** Maximum zoom level @default 500 */
  maxZoom?: number;
  /** Audio bar color. Accepts any CSS value including var(--*) tokens @default "var(--muted-foreground)" */
  waveColor?: string;
  /** Progress bar color. Accepts any CSS value including var(--*) tokens @default "var(--primary)" */
  progressColor?: string;
  /** Waveform bar width in px @default 3 */
  barWidth?: number;
  /** Waveform bar gap in px @default 2 */
  barGap?: number;
  /** Rounded borders for bars @default 2 */
  barRadius?: number;
  /** Waveform height in px @default 80 */
  waveHeight?: number;
  /** Called when playback starts */
  onPlay?: () => void;
  /** Called when playback pauses */
  onPause?: () => void;
  /** Called when playback finishes */
  onFinish?: () => void;
  /** Called with current time on every audio process tick */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WaveMinimap({
  src,
  title,
  defaultVolume = 0.8,
  minimapHeight = 30,
  minimapWaveColor = "var(--muted-foreground)",
  minimapProgressColor = "var(--primary)",
  overlayColor = "color-mix(in oklab, var(--primary) 15%, transparent)",
  defaultZoom = 100,
  minZoom = 10,
  maxZoom = 500,
  waveColor,
  progressColor,
  barWidth = 2,
  barGap = 1,
  barRadius = 2,
  waveHeight = 80,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
}: WaveMinimapProps) {
  const player = useWavePlayer({
    defaultVolume,
    onPlay,
    onPause,
    onFinish,
    onTimeUpdate,
  });
  const {
    isReady,
    isPlaying,
    currentTime,
    duration,
    progress,
    volume,
    isMuted,
  } = player;

  const [zoom, setZoom] = React.useState(defaultZoom);

  // The minimap draws on a <canvas>, so `var()` tokens must be resolved first.
  // `overlayColor` is applied to a DOM element and can stay a CSS expression.
  const resolvedMinimapWave = useCssVar(minimapWaveColor);
  const resolvedMinimapProgress = useCssVar(minimapProgressColor);

  // ── Memoized plugins ──────────────────────────────────────────────────────
  const plugins = React.useMemo(
    () =>
      typeof document === "undefined"
        ? []
        : [
            MinimapPlugin.create({
              height: minimapHeight,
              waveColor: resolvedMinimapWave,
              progressColor: resolvedMinimapProgress,
              overlayColor: overlayColor,
              insertPosition: "afterend",
            }),
          ],
    [minimapHeight, resolvedMinimapWave, resolvedMinimapProgress, overlayColor],
  );

  // ── Controls ──────────────────────────────────────────────────────────────

  const handleSeek = ([v]: number[]) => player.seek(v);
  const handleVolume = ([v]: number[]) => player.setVolume(v);

  // ── Zoom ──────────────────────────────────────────────────────────────────
  // Slider changes are coalesced to one `ws.zoom()` call per animation frame;
  // the slider position (`zoom` state) updates immediately.
  const zoomFrame = React.useRef<number | null>(null);
  const pendingZoom = React.useRef(defaultZoom);

  const applyZoom = (value: number) => {
    pendingZoom.current = value;
    if (zoomFrame.current !== null) return;
    zoomFrame.current = requestAnimationFrame(() => {
      zoomFrame.current = null;
      player.wavesurfer.current?.zoom(pendingZoom.current);
    });
  };

  React.useEffect(
    () => () => {
      if (zoomFrame.current !== null) cancelAnimationFrame(zoomFrame.current);
    },
    [],
  );

  const handleZoom = ([value]: number[]) => {
    setZoom(value);
    applyZoom(value);
  };

  const zoomIn = () => {
    const next = Math.min(zoom * 1.5, maxZoom);
    setZoom(next);
    player.wavesurfer.current?.zoom(next);
  };

  const zoomOut = () => {
    const next = Math.max(zoom / 1.5, minZoom);
    setZoom(next);
    player.wavesurfer.current?.zoom(next);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Card
      className={cn(
        "w-full px-0 border-0 rounded-none bg-transparent",
        className,
      )}
    >
      <CardContent className="border-0 px-0 space-y-3">
        {title && (
          <p className="text-sm font-medium text-foreground truncate">
            {title}
          </p>
        )}

        {/* Waveform + minimap */}
        <div className="relative w-full rounded-sm overflow-hidden border border-border">
          <WavesurferPlayer
            url={src}
            waveColor={waveColor}
            progressColor={progressColor}
            height={waveHeight}
            barWidth={barWidth}
            barGap={barGap}
            barRadius={barRadius}
            minPxPerSec={defaultZoom}
            fillParent
            dragToSeek
            hideScrollbar={false}
            plugins={plugins}
            {...player.handlers}
          />
        </div>

        {/* Seek bar */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] tabular-nums text-muted-foreground w-10 text-right shrink-0">
            {formatTime(currentTime)}
          </span>
          <Slider
            className="flex-1"
            value={[progress]}
            min={0}
            max={1}
            step={0.001}
            disabled={!isReady}
            onValueChange={handleSeek}
            aria-label="Seek"
          />
          <span className="text-[11px] tabular-nums text-muted-foreground w-10 shrink-0">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Playback */}
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={!isReady}
              onClick={player.restart}
              aria-label="Restart"
            >
              <RotateCcw size={15} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9"
              disabled={!isReady}
              onClick={player.togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={17} /> : <Play size={17} />}
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2 flex-1 max-w-50">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              disabled={!isReady || zoom <= minZoom}
              onClick={zoomOut}
              aria-label="Zoom out"
            >
              <ZoomOut size={15} />
            </Button>
            <Slider
              value={[zoom]}
              min={minZoom}
              max={maxZoom}
              step={1}
              disabled={!isReady}
              onValueChange={handleZoom}
              aria-label="Zoom"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              disabled={!isReady || zoom >= maxZoom}
              onClick={zoomIn}
              aria-label="Zoom in"
            >
              <ZoomIn size={15} />
            </Button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 w-32">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={player.toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolume}
              aria-label="Volume"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WaveMinimap;
