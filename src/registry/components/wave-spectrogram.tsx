"use client";

import * as React from "react";
import SpectrogramPlugin from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import WavesurferPlayer, { formatTime, useWavePlayer } from "@/lib/wave-cn";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WaveSpectrogramProps {
  /** Audio source URL */
  src: string;
  /** Optional title shown above the waveform */
  title?: string;
  /** Initial volume (0–1) */
  defaultVolume?: number;
  /** Spectrogram height in px @default 128 */
  spectrogramHeight?: number;
  /** FFT window size — higher = more frequency detail @default 512 */
  fftSamples?: 256 | 512 | 1024 | 2048;
  /** Show frequency axis labels @default true */
  showLabels?: boolean;
  /** Lowest frequency (Hz) rendered on the spectrogram @default 0 */
  frequencyMin?: number;
  /** Highest frequency (Hz) rendered on the spectrogram @default sampleRate / 2 */
  frequencyMax?: number;
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

export function WaveSpectrogram({
  src,
  title,
  defaultVolume = 0.8,
  spectrogramHeight = 128,
  fftSamples = 512,
  showLabels = true,
  frequencyMin,
  frequencyMax,
  waveColor,
  progressColor,
  barWidth,
  barGap,
  barRadius,
  waveHeight,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
}: WaveSpectrogramProps) {
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
    togglePlay,
    restart,
    toggleMute,
    seek,
    setVolume,
  } = player;

  // ── Memoized plugins ──────────────────────────────────────────────────────
  const plugins = React.useMemo(
    () =>
      typeof document === "undefined"
        ? []
        : [
            SpectrogramPlugin.create({
              height: spectrogramHeight,
              fftSamples,
              labels: showLabels,
              frequencyMin,
              frequencyMax,
            }),
          ],
    [spectrogramHeight, fftSamples, showLabels, frequencyMin, frequencyMax],
  );

  // ── Controls ──────────────────────────────────────────────────────────────
  const handleSeek = React.useCallback(([v]: number[]) => seek(v), [seek]);
  const handleVolume = React.useCallback(
    ([v]: number[]) => setVolume(v),
    [setVolume],
  );

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

        {/* Waveform + spectrogram */}
        <div className="relative w-full rounded-sm overflow-hidden border border-border">
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

          {/* Volume */}
          <div className="flex items-center gap-2 w-36">
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

export default WaveSpectrogram;
