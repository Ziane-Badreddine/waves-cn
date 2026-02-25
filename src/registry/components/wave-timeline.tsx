"use client";

import * as React from "react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
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
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import WavesurferPlayer from "@/registry/lib/wave-cn";
import type WaveSurfer from "wavesurfer.js";

// ─── Types
export interface TimelineOptions {
  height?: number;
  timeInterval?: number;
  primaryLabelInterval?: number;
  secondaryLabelInterval?: number;
  fontSize?: string;
}

export interface WaveTimelineProps {
  src: string;
  title?: string;
  defaultVolume?: number;
  waveColor?: string;
  progressColor?: string;
  barWidth?: number;
  barGap?: number;
  barRadius?: number;
  waveHeight?: number;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  topTimeline?: TimelineOptions | false;
  bottomTimeline?: TimelineOptions | false;
  onPlay?: () => void;
  onPause?: () => void;
  onFinish?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  className?: string;
}

// ─── Helpers
function formatTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Component
export function WaveTimeline({
  src,
  title,
  defaultVolume = 0.8,
  waveColor,
  progressColor,
  barWidth = 2,
  barGap = 1,
  barRadius = 2,
  waveHeight = 80,
  defaultZoom = 50,
  minZoom = 10,
  maxZoom = 500,
  topTimeline = {},
  bottomTimeline = false,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
}: WaveTimelineProps) {
  const wavesurferRef = React.useRef<WaveSurfer | null>(null);

  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(defaultVolume);
  const [isMuted, setIsMuted] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [zoom, setZoom] = React.useState(defaultZoom);

  // ── Memoized plugins ──────────────────────────────────────────────────────
  // Stable array reference — WavesurferPlayer uses reference equality to decide
  // whether to recreate the instance, so this must not change on every render.

  const plugins = React.useMemo(() => {
    if (typeof window === "undefined") return [];
    const list: InstanceType<typeof TimelinePlugin>[] = [];

    if (topTimeline !== false) {
      list.push(
        TimelinePlugin.create({
          height: topTimeline.height ?? 20,
          insertPosition: "beforebegin",
          timeInterval: topTimeline.timeInterval ?? 0.5,
          primaryLabelInterval: topTimeline.primaryLabelInterval ?? 5,
          secondaryLabelInterval: topTimeline.secondaryLabelInterval ?? 1,
          style: {
            fontSize: topTimeline.fontSize ?? "11px",
            color: "var(--muted-foreground)",
            background: "var(--muted)",
          },
        }),
      );
    }

    if (bottomTimeline !== false) {
      list.push(
        TimelinePlugin.create({
          height: bottomTimeline.height ?? 14,
          timeInterval: bottomTimeline.timeInterval ?? 0.1,
          primaryLabelInterval: bottomTimeline.primaryLabelInterval ?? 1,
          secondaryLabelInterval: bottomTimeline.secondaryLabelInterval,
          style: {
            fontSize: bottomTimeline.fontSize ?? "10px",
            color: "var(--muted-foreground)",
            background: "var(--muted)",
          },
        }),
      );
    }

    return list;
  }, [JSON.stringify(topTimeline), JSON.stringify(bottomTimeline)]);

  // ── Event handlers
  const handleReady = React.useCallback(
    (ws: WaveSurfer) => {
      wavesurferRef.current = ws;
      ws.setVolume(defaultVolume);
      setDuration(ws.getDuration());
      setIsReady(true);
    },
    [defaultVolume],
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

  // ── Zoom ──────────────────────────────────────────────────────────────────
  const handleZoom = React.useCallback((v: number[]) => {
    const value = v[0];
    setZoom(value);
    wavesurferRef.current?.zoom(value);
  }, []);

  const zoomIn = React.useCallback(() => {
    const next = Math.min(zoom * 1.5, maxZoom);
    setZoom(next);
    wavesurferRef.current?.zoom(next);
  }, [zoom, maxZoom]);

  const zoomOut = React.useCallback(() => {
    const next = Math.max(zoom / 1.5, minZoom);
    setZoom(next);
    wavesurferRef.current?.zoom(next);
  }, [zoom, minZoom]);

  // ── Playback ──────────────────────────────────────────────────────────────
  const togglePlay = React.useCallback(
    () => wavesurferRef.current?.playPause(),
    [],
  );

  const restart = React.useCallback(() => {
    if (!wavesurferRef.current || !isReady) return;
    wavesurferRef.current.setTime(0);
    wavesurferRef.current.play();
  }, [isReady]);

  const handleVolume = React.useCallback((v: number[]) => {
    const value = v[0];
    setVolume(value);
    setIsMuted(value === 0);
    wavesurferRef.current?.setVolume(value);
  }, []);

  const toggleMute = React.useCallback(() => {
    if (!wavesurferRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    wavesurferRef.current.setVolume(next ? 0 : volume);
  }, [isMuted, volume]);

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
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        {title && (
          <p className="text-sm font-medium text-foreground truncate">
            {title}
          </p>
        )}

        {/* Waveform + timeline */}
        <div className="relative w-full rounded-sm overflow-hidden border border-border">
          {!isReady && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[2px]"
              style={{ minHeight: waveHeight }}
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
            minPxPerSec={defaultZoom}
            fillParent
            dragToSeek
            hideScrollbar={false}
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Playback */}
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
              onClick={toggleMute}
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

export default WaveTimeline;
