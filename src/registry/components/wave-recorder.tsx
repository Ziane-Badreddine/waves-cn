"use client";

import {
  useRef,
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
import { cn } from "@/lib/utils";
import { formatTime, useCssVar, useWavesurfer } from "@/lib/wave-cn";

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
  audioBitsPerSecond?: RecordPluginOptions["audioBitsPerSecond"]; // default: 128000
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

type RecordPluginInstance = InstanceType<typeof RecordPlugin>;

export function WaveRecorder({
  onRecordEnd,
  onRecordStart,
  onRecordPause,
  onRecordResume,
  onDiscard,
  onError,
  maxDuration,
  mimeType,
  audioBitsPerSecond = 128000,
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
  // Live plugin instance. Kept in a ref (not state): it is only read from
  // event handlers, and the plugin effect must not call setState synchronously.
  const recordRef = useRef<RecordPluginInstance | null>(null);
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [duration, setDuration] = useState(0);

  const isDiscarding = useRef(false);
  const maxDurationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latest callback props, read at event time so the plugin effect never
  // needs to re-run when a parent passes a new inline function.
  const callbacks = useRef({
    onRecordEnd,
    onRecordStart,
    onRecordPause,
    onRecordResume,
    onDiscard,
  });
  useEffect(() => {
    callbacks.current = {
      onRecordEnd,
      onRecordStart,
      onRecordPause,
      onRecordResume,
      onDiscard,
    };
  });

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

  const clearMaxDurationTimer = useCallback(() => {
    if (maxDurationTimer.current) {
      clearTimeout(maxDurationTimer.current);
      maxDurationTimer.current = null;
    }
  }, []);

  // Plugin lifecycle + events
  useEffect(() => {
    if (!wavesurfer) return;

    const record = wavesurfer.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        continuousWaveform: false,
        scrollingWaveform: true,
        mimeType,
        audioBitsPerSecond,
        mediaRecorderTimeslice: 100,
      }),
    );
    recordRef.current = record;

    const unsubs = [
      // Only re-render when the displayed second changes.
      record.on("record-progress", (ms) => {
        setDuration((prev) =>
          Math.floor(ms / 1000) === Math.floor(prev / 1000) ? prev : ms,
        );
      }),

      record.on("record-start", () => {
        setRecordState("recording");
        setDuration(0);
        callbacks.current.onRecordStart?.();
      }),

      record.on("record-pause", () => {
        setRecordState("paused");
        callbacks.current.onRecordPause?.();
      }),

      record.on("record-resume", () => {
        setRecordState("recording");
        callbacks.current.onRecordResume?.();
      }),

      record.on("record-end", (blob: Blob) => {
        if (maxDurationTimer.current) {
          clearTimeout(maxDurationTimer.current);
          maxDurationTimer.current = null;
        }
        if (!isDiscarding.current) {
          callbacks.current.onRecordEnd?.(blob);
          setRecordState("done");
        } else {
          callbacks.current.onDiscard?.();
          setRecordState("idle");
        }
        isDiscarding.current = false;
        wavesurfer.empty();
        setDuration(0);
      }),
    ];

    return () => {
      unsubs.forEach((fn) => fn());
      if (maxDurationTimer.current) {
        clearTimeout(maxDurationTimer.current);
        maxDurationTimer.current = null;
      }
      if (record.isActive()) record.stopRecording();
      record.stopMic();
      record.destroy();
      if (recordRef.current === record) recordRef.current = null;
    };
  }, [wavesurfer, mimeType, audioBitsPerSecond]);

  // Actions

  const start = useCallback(async () => {
    const record = recordRef.current;
    if (!record || disabled) return;
    try {
      const deviceOptions: RecordPluginDeviceOptions = deviceId
        ? { deviceId: { exact: deviceId } }
        : {};
      await record.startRecording(deviceOptions);
      if (maxDuration && maxDuration > 0) {
        maxDurationTimer.current = setTimeout(
          () => record.stopRecording(),
          maxDuration * 1000,
        );
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }, [disabled, deviceId, maxDuration, onError]);

  const stop = useCallback(() => {
    clearMaxDurationTimer();
    recordRef.current?.stopRecording();
  }, [clearMaxDurationTimer]);

  const togglePause = useCallback(() => {
    const record = recordRef.current;
    if (!record) return;
    if (recordState === "paused") {
      record.resumeRecording();
    } else {
      record.pauseRecording();
    }
  }, [recordState]);

  const discard = useCallback(() => {
    clearMaxDurationTimer();
    isDiscarding.current = true;
    recordRef.current?.stopRecording();
    wavesurfer?.empty();
    setRecordState("idle");
    setDuration(0);
  }, [clearMaxDurationTimer, wavesurfer]);

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
          {formatTime(duration / 1000)}
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
