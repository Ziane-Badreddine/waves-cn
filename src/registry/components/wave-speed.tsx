"use client";

import { useState, useCallback, useRef, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import WavesurferPlayer from "@/lib/wave-cn";
import type WaveSurfer from "wavesurfer.js";

/**
 * Props for the WaveSpeed component
 */
export type WaveSpeedProps = {
  /** Audio file URL to load */
  url: string;
  /** Audio bar color. Accepts any CSS value including var(--*) tokens @default "var(--muted-foreground)" */
  waveColor?: string;
  /** Progress bar color. Accepts any CSS value including var(--*) tokens @default "var(--primary)" */
  progressColor?: string;
  /** Audio canvas height in px @default 64 */
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
  /** Root element class */
  className?: string;
  style?: CSSProperties;
};

/**
 * Audio player with variable playback speed control
 */
export function WaveSpeed({
  url,
  waveColor,
  progressColor,
  audioHeight,
  barWidth,
  barGap,
  barRadius,
  minSpeed = 0.25,
  maxSpeed = 4,
  defaultSpeed = 1,
  step = 0.25,
  className,
  style,
}: WaveSpeedProps) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [preservePitch, setPreservePitch] = useState(true);

  const togglePlay = useCallback(() => wavesurferRef.current?.playPause(), []);

  const handleSpeedChange = useCallback(
    ([value]: number[]) => {
      setSpeed(value);
      wavesurferRef.current?.setPlaybackRate(value, preservePitch);
    },
    [preservePitch],
  );

  const handlePreservePitch = useCallback(
    (checked: boolean) => {
      setPreservePitch(checked);
      wavesurferRef.current?.setPlaybackRate(speed, checked);
    },
    [speed],
  );

  return (
    <div className={cn("w-full space-y-4", className)} style={style}>
      {/* WavesurferPlayer renders the container div and wires up all events */}
      <div className="w-full rounded-md overflow-hidden bg-muted/40">
        <WavesurferPlayer
          url={url}
          waveColor={waveColor}
          progressColor={progressColor}
          height={audioHeight}
          barWidth={barWidth}
          barGap={barGap}
          barRadius={barRadius}
          dragToSeek
          onReady={(ws) => {
            wavesurferRef.current = ws;
            setIsReady(true);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onFinish={() => setIsPlaying(false)}
          onDestroy={() => {
            wavesurferRef.current = null;
            setIsReady(false);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
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
          variant="outline"
          className="text-sm text-muted-foreground tabular-nums shrink-0 pointer-events-none"
        >
          Playback rate:{" "}
          <span className="font-medium text-foreground">
            {speed.toFixed(2)}
          </span>
          x
        </Button>

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
            disabled={!isReady}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground shrink-0">
            {maxSpeed}x
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="preserve-pitch"
            checked={preservePitch}
            onCheckedChange={handlePreservePitch}
            disabled={!isReady}
          />
          <Label
            htmlFor="preserve-pitch"
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
