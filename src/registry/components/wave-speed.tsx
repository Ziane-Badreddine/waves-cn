"use client";

import { useState, useId, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import WavesurferPlayer, { useWavePlayer } from "@/lib/wave-cn";

/**
 * Props for the WaveSpeed component
 */
export type WaveSpeedProps = {
  /** Audio source URL */
  src?: string;
  /** @deprecated use `src` */
  url?: string;
  /** Optional title shown above the waveform */
  title?: string;
  /** Audio bar color. Accepts any CSS value including var(--*) tokens @default "var(--muted-foreground)" */
  waveColor?: string;
  /** Progress bar color. Accepts any CSS value including var(--*) tokens @default "var(--primary)" */
  progressColor?: string;
  /** Waveform height in px @default 64 */
  waveHeight?: number;
  /** @deprecated use `waveHeight` */
  audioHeight?: number;
  /** Bar width in px @default 3 */
  barWidth?: number;
  /** Gap between bars in px @default 2 */
  barGap?: number;
  /** Bar border radius in px @default 2 */
  barRadius?: number;
  /** Minimum playback speed @default 0.25 */
  minSpeed?: number;
  /** Maximum playback speed @default 4 */
  maxSpeed?: number;
  /** Initial playback speed @default 1 */
  defaultSpeed?: number;
  /** Slider step increment @default 0.25 */
  step?: number;
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
 * Audio player with variable playback speed control
 */
export function WaveSpeed({
  src,
  url,
  title,
  waveColor,
  progressColor,
  waveHeight,
  audioHeight,
  barWidth,
  barGap,
  barRadius,
  minSpeed = 0.25,
  maxSpeed = 4,
  defaultSpeed = 1,
  step = 0.25,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
  style,
}: WaveSpeedProps) {
  const source = src ?? url;
  const height = waveHeight ?? audioHeight;

  const player = useWavePlayer({ onPlay, onPause, onFinish, onTimeUpdate });
  const pitchId = useId();

  const [speed, setSpeed] = useState(defaultSpeed);
  const [preservePitch, setPreservePitch] = useState(true);

  const handleSpeedChange = ([value]: number[]) => {
    setSpeed(value);
    player.wavesurfer.current?.setPlaybackRate(value, preservePitch);
  };

  const handlePreservePitch = (checked: boolean) => {
    setPreservePitch(checked);
    player.wavesurfer.current?.setPlaybackRate(speed, checked);
  };

  return (
    <div className={cn("w-full space-y-4", className)} style={style}>
      {title && (
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
      )}

      {/* WavesurferPlayer renders the container div and wires up all events */}
      <div className="w-full rounded-md overflow-hidden bg-muted/40">
        <WavesurferPlayer
          url={source}
          waveColor={waveColor}
          progressColor={progressColor}
          height={height}
          barWidth={barWidth}
          barGap={barGap}
          barRadius={barRadius}
          dragToSeek
          {...player.handlers}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
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

        <span
          role="status"
          aria-live="polite"
          className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm text-muted-foreground tabular-nums shrink-0"
        >
          Playback rate:{" "}
          <span className="font-medium text-foreground">
            {speed.toFixed(2)}
          </span>
          x
        </span>

        <div className="flex items-center gap-3 flex-1 min-w-48">
          <span className="text-sm text-muted-foreground shrink-0">
            {minSpeed}x
          </span>
          <Slider
            min={minSpeed}
            max={maxSpeed}
            step={step}
            value={[speed]}
            onValueChange={handleSpeedChange}
            disabled={!player.isReady}
            className="flex-1"
            aria-label="Playback speed"
          />
          <span className="text-sm text-muted-foreground shrink-0">
            {maxSpeed}x
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id={pitchId}
            checked={preservePitch}
            onCheckedChange={handlePreservePitch}
            disabled={!player.isReady}
          />
          <Label
            htmlFor={pitchId}
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Preserve pitch
          </Label>
        </div>
      </div>
    </div>
  );
}

export default WaveSpeed;
