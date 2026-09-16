"use client";

import * as React from "react";
import EnvelopePlugin from "wavesurfer.js/dist/plugins/envelope.esm.js";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import WavesurferPlayer, {
  formatTime,
  useCssVar,
  useWavePlayer,
} from "@/lib/wave-cn";
import type WaveSurfer from "wavesurfer.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EnvelopePoint {
  time: number;
  volume: number;
}

export interface WaveEnvelopeProps {
  /** Audio source URL */
  src: string;
  /** Optional title shown above the waveform */
  title?: string;
  /** Initial volume (0–1) */
  defaultVolume?: number;
  /** Envelope line color @default "var(--primary)" */
  lineColor?: string;
  /** Envelope line width in px @default 2 */
  lineWidth?: number;
  /** Drag point radius in px @default 10 */
  dragPointSize?: number;
  /** Drag point fill color @default "var(--primary)" */
  dragPointFill?: string;
  /** Drag point stroke color @default "var(--background)" */
  dragPointStroke?: string;
  /** Fade in end time in seconds */
  fadeInEnd?: number;
  /** Fade out start time in seconds */
  fadeOutStart?: number;
  /** Audio bar color @default "var(--muted-foreground)" */
  waveColor?: string;
  /** Progress bar color @default "var(--primary)" */
  progressColor?: string;
  /** Waveform bar width in px @default 3 */
  barWidth?: number;
  /** Waveform bar gap in px @default 2 */
  barGap?: number;
  /** Rounded borders for bars @default 2 */
  barRadius?: number;
  /** Waveform height in px @default 64 */
  waveHeight?: number;
  /** Called when envelope volume changes during playback */
  onVolumeChange?: (volume: number) => void;
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

type EnvelopePluginInstance = InstanceType<typeof EnvelopePlugin>;

// ─── Component ───────────────────────────────────────────────────────────────

export function WaveEnvelope({
  src,
  title,
  defaultVolume = 0.8,
  lineColor = "var(--primary)",
  lineWidth = 2,
  dragPointSize = 10,
  dragPointFill = "var(--primary)",
  dragPointStroke = "var(--background)",
  fadeInEnd,
  fadeOutStart,
  waveColor,
  progressColor,
  barWidth,
  barGap,
  barRadius,
  waveHeight,
  onVolumeChange,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
}: WaveEnvelopeProps) {
  const [envelopePlugin, setEnvelopePlugin] =
    React.useState<EnvelopePluginInstance | null>(null);
  const [envelopeVolume, setEnvelopeVolume] = React.useState(defaultVolume);

  // Latest callback readable from the plugin listener without re-subscribing.
  const latest = React.useRef({ onVolumeChange });
  React.useEffect(() => {
    latest.current = { onVolumeChange };
  });

  // The envelope is drawn as SVG: resolve tokens to concrete colors.
  const resolvedLineColor = useCssVar(lineColor);
  const resolvedDragPointFill = useCssVar(dragPointFill);
  const resolvedDragPointStroke = useCssVar(dragPointStroke);

  // ── Build initial points from fade config ─────────────────────────────────
  const initialPoints = React.useMemo(() => {
    const pts: EnvelopePoint[] = [];
    if (fadeInEnd !== undefined && fadeInEnd > 0) {
      pts.push({ time: 0, volume: 0 });
      pts.push({ time: fadeInEnd, volume: defaultVolume });
    }
    if (fadeOutStart !== undefined) {
      pts.push({ time: fadeOutStart, volume: defaultVolume });
    }
    return pts;
  }, [fadeInEnd, fadeOutStart, defaultVolume]);

  // ── Memoized plugins ──────────────────────────────────────────────────────
  const plugins = React.useMemo(
    () =>
      typeof document === "undefined"
        ? []
        : [
            EnvelopePlugin.create({
              volume: defaultVolume,
              lineColor: resolvedLineColor,
              lineWidth: `${lineWidth}px`,
              dragPointSize,
              dragPointFill: resolvedDragPointFill,
              dragPointStroke: resolvedDragPointStroke,
              points: initialPoints.length > 0 ? initialPoints : undefined,
            }),
          ],
    [
      defaultVolume,
      resolvedLineColor,
      lineWidth,
      dragPointSize,
      resolvedDragPointFill,
      resolvedDragPointStroke,
      initialPoints,
    ],
  );

  // ── Player ────────────────────────────────────────────────────────────────
  const player = useWavePlayer({
    defaultVolume,
    onPlay,
    onPause,
    onFinish,
    onTimeUpdate,
    onReady: (ws) => {
      const live = ws
        .getActivePlugins()
        .find((p) => p instanceof EnvelopePlugin) as
        | EnvelopePluginInstance
        | undefined;
      setEnvelopePlugin(live ?? null);
    },
  });

  const handlers = React.useMemo(
    () => ({
      ...player.handlers,
      onDestroy: (ws: WaveSurfer) => {
        player.handlers.onDestroy?.(ws);
        setEnvelopePlugin(null);
      },
    }),
    [player.handlers],
  );

  // ── Envelope volume events ────────────────────────────────────────────────
  React.useEffect(() => {
    if (!envelopePlugin) return;
    const unsub = envelopePlugin.on("volume-change", (vol: number) => {
      setEnvelopeVolume(vol);
      latest.current.onVolumeChange?.(vol);
    });
    return () => unsub();
  }, [envelopePlugin]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const { seek } = player;
  const handleSeek = React.useCallback(([v]: number[]) => seek(v), [seek]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const { isReady, isPlaying, isMuted, currentTime, duration, progress } =
    player;

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

        {/* Waveform with envelope overlay */}
        <div className="relative w-full rounded-sm overflow-hidden bg-muted/40">
          <WavesurferPlayer
            url={src}
            waveColor={waveColor}
            progressColor={progressColor}
            height={waveHeight}
            barWidth={barWidth}
            barGap={barGap}
            barRadius={barRadius}
            dragToSeek
            plugins={plugins}
            {...handlers}
          />
        </div>

        {/* Volume indicator */}
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Envelope volume:{" "}
          <span className="tabular-nums font-medium text-foreground">
            {Math.round(envelopeVolume * 100)}%
          </span>
          <span className="ml-2 opacity-60">— drag points to adjust</span>
        </p>

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
        <div className="flex items-center justify-between gap-3">
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

          {/* Volume / Mute */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={player.toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WaveEnvelope;
