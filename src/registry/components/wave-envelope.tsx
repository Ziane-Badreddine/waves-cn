"use client";

import * as React from "react";
import EnvelopePlugin from "wavesurfer.js/dist/plugins/envelope.esm.js";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  RotateCcw,
} from "lucide-react";
import WavesurferPlayer from "@/lib/wave-cn";
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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
  const wavesurferRef = React.useRef<WaveSurfer | null>(null);

  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [envelopeVolume, setEnvelopeVolume] = React.useState(defaultVolume);

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
    () => [
      EnvelopePlugin.create({
        volume: defaultVolume,
        lineColor,
        lineWidth: `${lineWidth}px`,
        dragPointSize,
        dragPointFill,
        dragPointStroke,
        points: initialPoints.length > 0 ? initialPoints : undefined,
      }),
    ],
    [
      defaultVolume,
      lineColor,
      lineWidth,
      dragPointSize,
      dragPointFill,
      dragPointStroke,
      initialPoints,
    ],
  );

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleReady = React.useCallback(
    (ws: WaveSurfer) => {
      wavesurferRef.current = ws;
      setDuration(ws.getDuration());
      setIsReady(true);

      // Listen for envelope volume changes
      const ep = ws.getActivePlugins().find(
        (p) => p instanceof EnvelopePlugin,
      ) as InstanceType<typeof EnvelopePlugin> | undefined;

      if (ep) {
        ep.on("volume-change", (vol: number) => {
          setEnvelopeVolume(vol);
          onVolumeChange?.(vol);
        });
      }
    },
    [onVolumeChange],
  );

  const handlePlay = React.useCallback(() => {
    setIsPlaying(true);
    onPlay?.();
  }, [onPlay]);

  const handlePause = React.useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleFinish = React.useCallback(
    (_ws: WaveSurfer) => {
      setIsPlaying(false);
      onFinish?.();
    },
    [onFinish],
  );

  const handleTimeupdate = React.useCallback(
    (ws: WaveSurfer) => {
      const t = ws.getCurrentTime();
      setCurrentTime(t);
      onTimeUpdate?.(t, ws.getDuration());
    },
    [onTimeUpdate],
  );

  const handleSeeking = React.useCallback((ws: WaveSurfer) => {
    setCurrentTime(ws.getCurrentTime());
  }, []);

  const handleDestroy = React.useCallback(() => {
    wavesurferRef.current = null;
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  // ── Controls ──────────────────────────────────────────────────────────────

  const togglePlay = React.useCallback(
    () => wavesurferRef.current?.playPause(),
    [],
  );

  const restart = React.useCallback(() => {
    if (!wavesurferRef.current || !isReady) return;
    wavesurferRef.current.setTime(0);
    wavesurferRef.current.play();
  }, [isReady]);

  const toggleMute = React.useCallback(() => {
    if (!wavesurferRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    wavesurferRef.current.setMuted(next);
  }, [isMuted]);

  const handleSeek = React.useCallback(
    ([v]: number[]) => {
      if (!wavesurferRef.current || !isReady) return;
      wavesurferRef.current.seekTo(v);
    },
    [isReady],
  );

  // ── Derived ───────────────────────────────────────────────────────────────
  const progress = duration > 0 ? currentTime / duration : 0;

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
          {!isReady && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[2px]"
              style={{ height: waveHeight ?? 64 }}
            >
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
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
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onFinish={handleFinish}
            onTimeupdate={handleTimeupdate}
            onSeeking={handleSeeking}
            onDestroy={handleDestroy}
          />
        </div>

        {/* Volume indicator */}
        <p className="text-xs text-muted-foreground">
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
              onClick={restart}
              aria-label="Restart"
            >
              <RotateCcw size={15} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9"
              disabled={!isReady}
              onClick={togglePlay}
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
              onClick={toggleMute}
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
