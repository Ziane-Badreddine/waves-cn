"use client";

import {
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type VideoHTMLAttributes,
} from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import WavesurferPlayer from "@/lib/wave-cn";
import type WaveSurfer from "wavesurfer.js";

/**
 * Props for the WaveVideo component
 */
export type WaveVideoProps = {
  /** Video file URL to load */
  url: string;
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
  url,
  waveColor,
  progressColor,
  waveHeight,
  barWidth,
  barGap,
  barRadius,
  showVideo = true,
  className,
  style,
  videoClassName,
  videoStyle,
  waveformClassName,
  waveClassName,
  videoProps,
}: WaveVideoProps) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // Callback ref — triggers a re-render the moment the <video> mounts
  // so WavesurferPlayer receives the actual HTMLVideoElement, not null.
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const videoCallbackRef = useCallback((el: HTMLVideoElement | null) => {
    setVideoEl(el);
  }, []);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => wavesurferRef.current?.playPause(), []);

  return (
    <div className={cn("w-full space-y-2 max-w-2xl", className)} style={style}>
      {/* Video element — wavesurfer uses it as media source via the `media` prop */}
      {showVideo && (
        <video
          ref={videoCallbackRef}
          src={url}
          controls={false}
          playsInline
          className={cn("w-full mx-auto bg-black", videoClassName)}
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

          <WavesurferPlayer
            url=""
            media={videoEl}
            waveColor={waveColor}
            progressColor={progressColor}
            height={waveHeight}
            barWidth={barWidth}
            barGap={barGap}
            barRadius={barRadius}
            dragToSeek
            className={cn("w-full", waveClassName)}
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
      )}
    </div>
  );
}

export default WaveVideo;
