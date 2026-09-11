"use client";

import { useState } from "react";
import WavesurferPlayer from "@/lib/wave-cn";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import type WaveSurfer from "wavesurfer.js";

const HEIGHT = 112;

function fmt(s: number) {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function WaveHero() {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ws, setWs] = useState<WaveSurfer | null>(null);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  return (
    <div className="relative flex h-full w-full flex-col justify-between gap-5">
      {/* Track header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 items-center justify-center rounded-lg border bg-background">
            <Volume2 className="size-4 text-muted-foreground" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium">Coastline</p>
            <p className="text-xs text-muted-foreground">
              Demo track · wave-player
            </p>
          </div>
        </div>
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          <span className="text-foreground">{fmt(current)}</span> /{" "}
          {fmt(duration)}
        </p>
      </div>

      {/* Waveform */}
      <div className="relative" style={{ minHeight: HEIGHT }}>
        {!isReady && (
          <Skeleton
            className="absolute inset-x-0 top-0 w-full rounded-lg"
            style={{ height: HEIGHT }}
          />
        )}
        <div
          className={cn(
            "transition-opacity duration-700",
            isReady ? "opacity-100" : "opacity-0",
          )}
        >
          <WavesurferPlayer
            url="/coastline.mp3"
            height={HEIGHT}
            barWidth={3}
            barGap={2}
            barRadius={3}
            cursorWidth={2}
            dragToSeek
            onReady={(instance, d) => {
              setWs(instance);
              setDuration(d);
              setIsReady(true);
            }}
            onLoad={() => setIsReady(false)}
            onTimeupdate={(_, t) => setCurrent(t)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onInteraction={(instance) => {
              if (!instance.isPlaying()) instance.play();
            }}
            onFinish={(instance) => {
              instance.setTime(0);
              setIsPlaying(false);
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!isReady}
            onClick={() => ws?.playPause()}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="inline-flex items-center gap-2 rounded-full bg-primary py-2 pl-3 pr-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary-foreground/15">
              {isPlaying ? (
                <Pause className="size-3.5 fill-current" />
              ) : (
                <Play className="size-3.5 translate-x-px fill-current" />
              )}
            </span>
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            disabled={!isReady}
            onClick={() => ws?.setTime(0)}
            aria-label="Restart"
            className="inline-flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        <p className="hidden text-xs text-muted-foreground sm:block">
          Click or drag the waveform to seek
        </p>
      </div>
    </div>
  );
}
