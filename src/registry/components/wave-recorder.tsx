"use client";

import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import { Button } from "@/components/ui/button";
import { Mic, Pause, Play, Square, Trash2 } from "lucide-react";
import RecordPlugin, {
  type RecordPluginOptions,
  type RecordPluginDeviceOptions,
} from "wavesurfer.js/dist/plugins/record.esm.js";
import { cn, formatDuration } from "@/lib/utils";
import { useCssVar } from "@/hooks/use-css-var";
import { useWavesurfer } from "@/registry/lib/wave-cn";

// Types

export type RecordState = "idle" | "recording" | "paused" | "done";

export type WaveRecorderProps = {
  // Callbacks
  onRecordEnd?: (blob: Blob) => void;
  onRecordStart?: () => void;
  onRecordPause?: () => void;
  onRecordResume?: () => void;
  onDiscard?: () => void;
  onError?: (error: Error) => void;

  // Behaviour
  maxDuration?: number;
  mimeType?: RecordPluginOptions["mimeType"];
  audioBitsPerSecond?: RecordPluginOptions["audioBitsPerSecond"];
  deviceId?: string;
  disabled?: boolean;

  // Display
  showWaveform?: boolean; // default: true
  showTimer?: boolean; // default: true
  waveColor?: string;
  progressColor?: string;
  waveformHeight?: number; // default: 64
  barWidth?: number; // default: 3
  barGap?: number; // default: 2
  barRadius?: number; // default: 30
  barHeight?: number; // default: 0.8

  // Style
  className?: string;
  style?: CSSProperties;
  waveformClassName?: string;
  timerClassName?: string;
  controlsClassName?: string;
};

export function WaveRecorder({
  onRecordEnd,
  onRecordStart,
  onRecordPause,
  onRecordResume,
  onDiscard,
  onError,
  maxDuration,
  mimeType,
  audioBitsPerSecond = 1,
  deviceId,
  disabled = false,
  showWaveform = true,
  showTimer = true,
  waveColor = "var(--primary)",
  progressColor = "var(--background)",
  waveformHeight = 64,
  barWidth = 3,
  barGap = 2,
  barRadius = 2,
  barHeight,
  className,
  style,
  waveformClassName,
  timerClassName,
  controlsClassName,
}: WaveRecorderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [recordPlugin, setRecordPlugin] = useState<InstanceType<
    typeof RecordPlugin
  > | null>(null);
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [duration, setDuration] = useState(0);

  const isDiscarding = useRef(false);
  const maxDurationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedWaveColor = useCssVar(waveColor);
  const resolvedProgressColor = useCssVar(progressColor);

  const { wavesurfer } = useWavesurfer({
    container: containerRef,
    waveColor: resolvedWaveColor,
    progressColor: resolvedProgressColor,
    height: waveformHeight,
    barWidth,
    barGap,
    barRadius,
    barHeight,
  });

  // Plugin events
  useEffect(() => {
    if (!wavesurfer) return;

    wavesurfer.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        continuousWaveform: false,
        scrollingWaveform: true,
        mimeType,
        audioBitsPerSecond,
        mediaRecorderTimeslice: 100,
      }),
    );

    const record = wavesurfer
      .getActivePlugins()
      .find((p) => p instanceof RecordPlugin) as
      | InstanceType<typeof RecordPlugin>
      | undefined;

    if (!record) return;
    setRecordPlugin(record);

    const unsubs = [
      record.on("record-progress", (ms) => setDuration(ms)),

      record.on("record-start", () => {
        setRecordState("recording");
        setDuration(0);
        onRecordStart?.();
      }),

      record.on("record-pause", () => {
        setRecordState("paused");
        onRecordPause?.();
      }),

      record.on("record-resume", () => {
        setRecordState("recording");
        onRecordResume?.();
      }),

      record.on("record-end", (blob: Blob) => {
        if (maxDurationTimer.current) {
          clearTimeout(maxDurationTimer.current);
          maxDurationTimer.current = null;
        }
        if (!isDiscarding.current) {
          onRecordEnd?.(blob);
          setRecordState("done");
        } else {
          onDiscard?.();
          setRecordState("idle");
        }
        isDiscarding.current = false;
        wavesurfer.empty();
        setDuration(0);
      }),
    ];

    return () => unsubs.forEach((fn) => fn());
  }, [wavesurfer]);

  // Actions

  const start = useCallback(async () => {
    if (!recordPlugin || disabled) return;
    try {
      const deviceOptions: RecordPluginDeviceOptions = deviceId
        ? { deviceId: { exact: deviceId } }
        : {};
      await recordPlugin.startRecording(deviceOptions);
      if (maxDuration && maxDuration > 0) {
        maxDurationTimer.current = setTimeout(
          () => recordPlugin.stopRecording(),
          maxDuration * 1000,
        );
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }, [recordPlugin, disabled, deviceId, maxDuration, onError]);

  const stop = useCallback(() => {
    if (maxDurationTimer.current) {
      clearTimeout(maxDurationTimer.current);
      maxDurationTimer.current = null;
    }
    recordPlugin?.stopRecording();
  }, [recordPlugin]);

  const togglePause = useCallback(() => {
    if (!recordPlugin) return;
    recordState === "paused"
      ? recordPlugin.resumeRecording()
      : recordPlugin.pauseRecording();
  }, [recordPlugin, recordState]);

  const discard = useCallback(() => {
    if (maxDurationTimer.current) {
      clearTimeout(maxDurationTimer.current);
      maxDurationTimer.current = null;
    }
    isDiscarding.current = true;
    recordPlugin?.stopRecording();
    wavesurfer?.empty();
    setRecordState("idle");
    setDuration(0);
  }, [recordPlugin, wavesurfer]);

  // Derived

  const isActive = recordState === "recording" || recordState === "paused";
  const isPaused = recordState === "paused";

  // Render

  return (
    <div className={cn("w-full space-y-3 ", className)} style={style}>
      {/* Waveform — always mounted for stable DOM ref, hidden when idle */}
      <div
        className={cn(
          "flex items-center w-full ",
          (!showWaveform && !showTimer) || !isActive ? "hidden" : "opacity-100",
        )}
      >
        <div
          ref={containerRef}
          aria-hidden="true"
          className={cn(
            "overflow-hidden transition-all duration-300 w-full",
            showWaveform && isActive
              ? "opacity-100 mb-2"
              : "opacity-0 h-0 pointer-events-none",
            waveformClassName,
          )}
          style={
            showWaveform && isActive ? { height: waveformHeight } : undefined
          }
        />
      </div>

      {/* Controls */}

      {showTimer && isActive && (
        <p
          className={cn(
            "text-base tabular-nums text-muted-foreground shrink-0 text-center",
            timerClassName,
          )}
        >
          {formatDuration(duration)}
        </p>
      )}
      <div
        className={cn(
          "flex items-center gap-2 justify-center",
          controlsClassName,
        )}
      >
        {!isActive && (
          <Button
            size="icon"
            variant="secondary"
            onClick={start}
            disabled={disabled}
            aria-label="Start recording"
          >
            <Mic className="size-4" />
          </Button>
        )}

        {isActive && (
          <>
            <Button
              size="icon"
              variant="outline"
              onClick={discard}
              disabled={disabled}
              aria-label="Discard recording"
              className="hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={stop}
              disabled={disabled}
              aria-label="Stop recording"
            >
              <Square className="size-4" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={togglePause}
              disabled={disabled}
              aria-label={isPaused ? "Resume recording" : "Pause recording"}
            >
              {isPaused ? (
                <Play className="size-4" />
              ) : (
                <Pause className="size-4" />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default WaveRecorder;
