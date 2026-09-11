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
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import WavesurferPlayer, { formatTime, useWavePlayer } from "@/lib/wave-cn";

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

  // ── Memoized plugins ──────────────────────────────────────────────────────
  // Stable array reference — WavesurferPlayer uses reference equality to decide
  // whether to recreate the instance, so this must not change on every render.
  // Option fields are destructured into primitives so the memo deps stay simple.
  const topOn = topTimeline !== false;
  const topHeight = topOn ? topTimeline.height : undefined;
  const topTimeInterval = topOn ? topTimeline.timeInterval : undefined;
  const topPrimaryLabelInterval = topOn
    ? topTimeline.primaryLabelInterval
    : undefined;
  const topSecondaryLabelInterval = topOn
    ? topTimeline.secondaryLabelInterval
    : undefined;
  const topFontSize = topOn ? topTimeline.fontSize : undefined;

  const bottomOn = bottomTimeline !== false;
  const bottomHeight = bottomOn ? bottomTimeline.height : undefined;
  const bottomTimeInterval = bottomOn ? bottomTimeline.timeInterval : undefined;
  const bottomPrimaryLabelInterval = bottomOn
    ? bottomTimeline.primaryLabelInterval
    : undefined;
  const bottomSecondaryLabelInterval = bottomOn
    ? bottomTimeline.secondaryLabelInterval
    : undefined;
  const bottomFontSize = bottomOn ? bottomTimeline.fontSize : undefined;

  const plugins = React.useMemo(() => {
    if (typeof document === "undefined") return [];
    const list: InstanceType<typeof TimelinePlugin>[] = [];

    if (topOn) {
      list.push(
        TimelinePlugin.create({
          height: topHeight ?? 20,
          insertPosition: "beforebegin",
          timeInterval: topTimeInterval ?? 0.5,
          primaryLabelInterval: topPrimaryLabelInterval ?? 5,
          secondaryLabelInterval: topSecondaryLabelInterval ?? 1,
          style: {
            fontSize: topFontSize ?? "11px",
            color: "var(--muted-foreground)",
            background: "var(--muted)",
          },
        }),
      );
    }

    if (bottomOn) {
      list.push(
        TimelinePlugin.create({
          height: bottomHeight ?? 14,
          timeInterval: bottomTimeInterval ?? 0.1,
          primaryLabelInterval: bottomPrimaryLabelInterval ?? 1,
          secondaryLabelInterval: bottomSecondaryLabelInterval,
          style: {
            fontSize: bottomFontSize ?? "10px",
            color: "var(--muted-foreground)",
            background: "var(--muted)",
          },
        }),
      );
    }

    return list;
  }, [
    topOn,
    topHeight,
    topTimeInterval,
    topPrimaryLabelInterval,
    topSecondaryLabelInterval,
    topFontSize,
    bottomOn,
    bottomHeight,
    bottomTimeInterval,
    bottomPrimaryLabelInterval,
    bottomSecondaryLabelInterval,
    bottomFontSize,
  ]);

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

  // ── Playback ──────────────────────────────────────────────────────────────
  const handleSeek = ([v]: number[]) => player.seek(v);
  const handleVolume = ([v]: number[]) => player.setVolume(v);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Card
      className={cn(
        "w-full px-0 border-none rounded-none bg-transparent",
        className,
      )}
    >
      <CardContent className=" space-y-3 p-0">
        {/* Title */}
        {title && (
          <p className="text-sm font-medium text-foreground truncate">
            {title}
          </p>
        )}

        {/* Waveform + timeline */}
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

export default WaveTimeline;
