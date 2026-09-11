"use client";

import {
  useState,
  useCallback,
  type CSSProperties,
  type VideoHTMLAttributes,
} from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import WavesurferPlayer, { useWavePlayer } from "@/lib/wave-cn";

/**
 * Props for the WaveVideo component
 */
export type WaveVideoProps = {
  /** Video source URL */
  src?: string;
  /** @deprecated use `src` */
  url?: string;
  /** Optional title shown above the video */
  title?: string;
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
  /** Show the native video element @default true */
  showVideo?: boolean;
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
  /** Root element inline style */
  style?: CSSProperties;
  /** Class applied to the <video> element */
  videoClassName?: string;
  /** Inline style applied to the <video> element */
  videoStyle?: CSSProperties;
  /** Class applied to the waveform + controls container */
  waveformClassName?: string;
  /** Class applied to the WavesurferPlayer canvas wrapper */
  waveClassName?: string;
  /** Extra props forwarded to the <video> element (e.g. poster, loop, muted) */
  videoProps?: VideoHTMLAttributes<HTMLVideoElement>;
};

/**
 * Waveform synced to a video element — wavesurfer.js reads the video
 * as its media source via the `media` prop so playback stays in sync.
 */
export function WaveVideo({
  src,
  url,
  title,
  waveColor,
  progressColor,
  waveHeight,
  barWidth,
  barGap,
  barRadius,
  showVideo = true,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
  style,
  videoClassName,
  videoStyle,
  waveformClassName,
  waveClassName,
  videoProps,
}: WaveVideoProps) {
  const source = src ?? url;

  const player = useWavePlayer({ onPlay, onPause, onFinish, onTimeUpdate });

  // Callback ref — triggers a re-render the moment the <video> mounts
  // so WavesurferPlayer receives the actual HTMLVideoElement, not null.
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const videoCallbackRef = useCallback((el: HTMLVideoElement | null) => {
    setVideoEl(el);
  }, []);

  return (
    <div className={cn("w-full space-y-2 max-w-2xl", className)} style={style}>
      {title && (
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
      )}

      {/* Video element — wavesurfer uses it as media source via the `media` prop */}
      {showVideo && (
        <video
          ref={videoCallbackRef}
          src={source}
          controls={false}
          playsInline
          className={cn("w-full mx-auto bg-muted", videoClassName)}
          style={videoStyle}
          {...videoProps}
        />
      )}

      {/* Waveform + controls — only mounts once the video element is available */}
      {videoEl && (
        <div
          className={cn(
            "w-full flex items-center gap-2 rounded-md overflow-hidden bg-muted/40 px-2",
            waveformClassName,
          )}
        >
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

          <WavesurferPlayer
            media={videoEl}
            waveColor={waveColor}
            progressColor={progressColor}
            height={waveHeight}
            barWidth={barWidth}
            barGap={barGap}
            barRadius={barRadius}
            dragToSeek
            className={cn("w-full", waveClassName)}
            {...player.handlers}
          />
        </div>
      )}
    </div>
  );
}

export default WaveVideo;
