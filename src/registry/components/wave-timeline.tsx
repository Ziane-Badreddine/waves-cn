"use client";

import * as React from "react";
import WaveSurfer from "wavesurfer.js";
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
import { useCssVar } from "@/hooks/use-css-var";

// Types

export interface TimelineOptions {
  height?: number;
  timeInterval?: number;
  primaryLabelInterval?: number;
  secondaryLabelInterval?: number;
  fontSize?: string;
  position?: "top" | "bottom";
}

export interface AudioTimelineProps {
  src: string;
  title?: string;
  defaultVolume?: number;
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

// Helpers

function formatTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Component

export function AudioTimeline({
  src,
  title,
  defaultVolume = 0.8,
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
}: AudioTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const waveRef = React.useRef<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isReady, setIsReady] = React.useState(false);
  const [volume, setVolume] = React.useState(defaultVolume);
  const [isMuted, setIsMuted] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [zoom, setZoom] = React.useState(defaultZoom);

  // Resolve shadcn CSS vars → real color strings via the hook
  const waveColor = useCssVar("var(--muted-foreground)");
  const progressColor = useCssVar("var(--primary)");
  const cursorColor = useCssVar("var(--primary)");
  const labelColor = useCssVar("var(--muted-foreground)");
  const mutedColor = useCssVar("var(--muted)");

  // Init

  React.useEffect(() => {
    if (!containerRef.current) return;
    if (!waveColor || !progressColor) return;

    setIsLoading(true);
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    //Build timeline plugins

    const plugins: InstanceType<typeof TimelinePlugin>[] = [];

    if (topTimeline !== false) {
      plugins.push(
        TimelinePlugin.create({
          height: topTimeline.height ?? 20,
          insertPosition: "beforebegin", // renders ABOVE the waveform
          timeInterval: topTimeline.timeInterval ?? 0.5,
          primaryLabelInterval: topTimeline.primaryLabelInterval ?? 5,
          secondaryLabelInterval: topTimeline.secondaryLabelInterval ?? 1,
          style: {
            fontSize: topTimeline.fontSize ?? "11px",
            color: labelColor,
            background: mutedColor,
          },
        }),
      );
    }

    if (bottomTimeline !== false) {
      plugins.push(
        TimelinePlugin.create({
          height: bottomTimeline.height ?? 14,
          timeInterval: bottomTimeline.timeInterval ?? 0.1,
          primaryLabelInterval: bottomTimeline.primaryLabelInterval ?? 1,
          secondaryLabelInterval: bottomTimeline.secondaryLabelInterval,
          style: {
            fontSize: bottomTimeline.fontSize ?? "10px",
            color: labelColor,
            background: mutedColor,
          },
        }),
      );
    }

    // ── Create WaveSurfer

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: waveHeight,
      waveColor,
      progressColor,
      cursorColor,
      cursorWidth: 2,
      barWidth,
      barGap,
      barRadius,
      minPxPerSec: defaultZoom,
      fillParent: true,
      url: src,
      interact: true,
      dragToSeek: true,
      hideScrollbar: false, // show scrollbar so user can pan when zoomed in
      audioRate: 1,
      normalize: false,
      plugins,
    });

    waveRef.current = ws;
    ws.setVolume(defaultVolume);

    ws.on("loading", () => setIsLoading(true));
    ws.on("ready", () => {
      setDuration(ws.getDuration());
      setIsLoading(false);
      setIsReady(true);
    });
    ws.on("audioprocess", () => {
      const t = ws.getCurrentTime();
      setCurrentTime(t);
      onTimeUpdate?.(t, ws.getDuration());
    });
    ws.on("seeking", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("play", () => {
      setIsPlaying(true);
      onPlay?.();
    });
    ws.on("pause", () => {
      setIsPlaying(false);
      onPause?.();
    });
    ws.on("finish", () => {
      setIsPlaying(false);
      onFinish?.();
    });

    return () => ws.destroy();
    // Re-init when src or resolved colors change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, waveColor, progressColor, labelColor, mutedColor]);

  // ── Zoom ─────────────────────────────────────────────────────────────────

  const handleZoom = (v: number[]) => {
    const value = v[0];
    setZoom(value);
    waveRef.current?.zoom(value);
  };

  const zoomIn = () => {
    const next = Math.min(zoom * 1.5, maxZoom);
    setZoom(next);
    waveRef.current?.zoom(next);
  };

  const zoomOut = () => {
    const next = Math.max(zoom / 1.5, minZoom);
    setZoom(next);
    waveRef.current?.zoom(next);
  };

  // Playback

  const togglePlay = () => waveRef.current?.playPause();

  const restart = () => {
    if (!waveRef.current || !isReady) return;
    waveRef.current.setTime(0);
    waveRef.current.play();
  };

  const handleVolume = (v: number[]) => {
    const value = v[0];
    setVolume(value);
    setIsMuted(value === 0);
    waveRef.current?.setVolume(value);
  };

  const toggleMute = () => {
    if (!waveRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    waveRef.current.setVolume(next ? 0 : volume);
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  // Render

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
          {isLoading && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[2px]"
              style={{ minHeight: waveHeight }}
            >
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          {/* WaveSurfer + TimelinePlugin mount here */}
          <div ref={containerRef} className="w-full" />
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
            onValueChange={([v]) => {
              if (!waveRef.current || !isReady) return;
              waveRef.current.seekTo(v);
            }}
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
          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
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

export default AudioTimeline;
