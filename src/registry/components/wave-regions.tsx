"use client";

import * as React from "react";
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.esm.js";
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
  Repeat,
  Trash2,
} from "lucide-react";
import WavesurferPlayer from "@/lib/wave-cn";
import type WaveSurfer from "wavesurfer.js";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RegionData {
  id: string;
  start: number;
  end: number;
  color?: string;
  content?: string;
}

export interface WaveRegionsProps {
  /** Audio source URL */
  src: string;
  /** Optional title shown above the waveform */
  title?: string;
  /** Initial volume (0–1) */
  defaultVolume?: number;
  /** Allow creating and editing regions */
  editable?: boolean;
  /** Default color for new regions */
  regionColor?: string;
  /** Color for the active (looping) region */
  activeRegionColor?: string;
  /** Audio bar color. Accepts any CSS value including var(--*) tokens @default "var(--muted-foreground)" */
  waveColor?: string;
  /** Progress bar color. Accepts any CSS value including var(--*) tokens @default "var(--primary)" */
  progressColor?: string;
  /** Waveform bar width in px @default 3 */
  barWidth?: number;
  /** Waveform bar gap in px @default 2 */
  barGap?: number;
  /** Rounded borders for bars @default 2 */
  barRadius?: number;
  /** Waveform height in px @default 64 */
  waveHeight?: number;
  /** Called when a region is created by the user */
  onRegionCreated?: (region: RegionData) => void;
  /** Called when a region is updated (moved/resized) */
  onRegionUpdated?: (region: RegionData) => void;
  /** Called when a region is removed */
  onRegionRemoved?: (id: string) => void;
  /** Called when a region is clicked */
  onRegionClicked?: (region: RegionData) => void;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function toRegionData(r: Region): RegionData {
  return {
    id: r.id,
    start: r.start,
    end: r.end,
    color: r.color,
    content: r.content?.textContent ?? undefined,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WaveRegions({
  src,
  title,
  defaultVolume = 0.8,
  editable = true,
  regionColor = "rgba(59, 130, 246, 0.3)",
  activeRegionColor = "rgba(59, 130, 246, 0.5)",
  waveColor,
  progressColor,
  barWidth,
  barGap,
  barRadius,
  waveHeight,
  onRegionCreated,
  onRegionUpdated,
  onRegionRemoved,
  onRegionClicked,
  className,
}: WaveRegionsProps) {
  const wavesurferRef = React.useRef<WaveSurfer | null>(null);
  const regionsRef = React.useRef<InstanceType<typeof RegionsPlugin> | null>(
    null,
  );

  const [isReady, setIsReady] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(defaultVolume);
  const [isMuted, setIsMuted] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [regions, setRegions] = React.useState<RegionData[]>([]);
  const [activeRegionId, setActiveRegionId] = React.useState<string | null>(
    null,
  );
  const [isLooping, setIsLooping] = React.useState(false);

  // ── Memoized plugin ──────────────────────────────────────────────────────
  const plugins = React.useMemo(
    () => (typeof document === "undefined" ? [] : [RegionsPlugin.create()]),
    [],
  );

  // ── Event handlers ───────────────────────────────────────────────────────

  const handleReady = React.useCallback(
    (ws: WaveSurfer) => {
      wavesurferRef.current = ws;
      ws.setVolume(defaultVolume);
      setDuration(ws.getDuration());
      setIsReady(true);

      // Get the regions plugin instance
      const rp = ws.getActivePlugins().find((p) => p instanceof RegionsPlugin) as
        | InstanceType<typeof RegionsPlugin>
        | undefined;
      if (!rp) return;
      regionsRef.current = rp;

      if (editable) {
        rp.enableDragSelection({
          color: regionColor,
          resize: true,
          drag: true,
        });
      }

      // Region events
      rp.on("region-created", (region: Region) => {
        if (editable) {
          region.setOptions({ color: regionColor, resize: true, drag: true });
        }
        const data = toRegionData(region);
        setRegions((prev) => {
          if (prev.some((r) => r.id === data.id)) return prev;
          return [...prev, data];
        });
        onRegionCreated?.(data);
      });

      rp.on("region-updated", (region: Region) => {
        const data = toRegionData(region);
        setRegions((prev) =>
          prev.map((r) => (r.id === data.id ? data : r)),
        );
        onRegionUpdated?.(data);
      });

      rp.on("region-removed", (region: Region) => {
        setRegions((prev) => prev.filter((r) => r.id !== region.id));
        if (activeRegionId === region.id) {
          setActiveRegionId(null);
          setIsLooping(false);
        }
        onRegionRemoved?.(region.id);
      });

      rp.on("region-clicked", (region: Region, e: MouseEvent) => {
        e.stopPropagation();
        setActiveRegionId(region.id);
        onRegionClicked?.(toRegionData(region));
      });
    },
    [
      defaultVolume,
      editable,
      regionColor,
      activeRegionId,
      onRegionCreated,
      onRegionUpdated,
      onRegionRemoved,
      onRegionClicked,
    ],
  );

  // ── Loop active region ───────────────────────────────────────────────────
  React.useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws || !isLooping || !activeRegionId) return;

    const rp = regionsRef.current;
    if (!rp) return;

    const allRegions = rp.getRegions();
    const active = allRegions.find((r) => r.id === activeRegionId);
    if (!active) return;

    // Play the active region
    active.play();

    const unsub = rp.on("region-out", (region) => {
      if (region.id === active.id && isLooping) active.play();
    });

    return () => unsub();
  }, [isLooping, activeRegionId]);

  // ── Highlight active region ──────────────────────────────────────────────
  React.useEffect(() => {
    const rp = regionsRef.current;
    if (!rp) return;

    const allRegions = rp.getRegions();
    allRegions.forEach((r) => {
      r.setOptions({
        color: r.id === activeRegionId ? activeRegionColor : regionColor,
      });
    });
  }, [activeRegionId, regionColor, activeRegionColor]);

  const handlePlay = React.useCallback(() => setIsPlaying(true), []);
  const handlePause = React.useCallback(() => setIsPlaying(false), []);
  const handleFinish = React.useCallback(() => setIsPlaying(false), []);

  const handleTimeupdate = React.useCallback((ws: WaveSurfer) => {
    setCurrentTime(ws.getCurrentTime());
  }, []);

  const handleSeeking = React.useCallback((ws: WaveSurfer) => {
    setCurrentTime(ws.getCurrentTime());
  }, []);

  const handleDestroy = React.useCallback(() => {
    wavesurferRef.current = null;
    regionsRef.current = null;
    setIsReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setRegions([]);
    setActiveRegionId(null);
  }, []);

  // ── Controls ─────────────────────────────────────────────────────────────

  const togglePlay = React.useCallback(
    () => wavesurferRef.current?.playPause(),
    [],
  );

  const restart = React.useCallback(() => {
    if (!wavesurferRef.current || !isReady) return;
    wavesurferRef.current.setTime(0);
    wavesurferRef.current.play();
  }, [isReady]);

  const handleVolume = React.useCallback((v: number[]) => {
    const value = v[0];
    setVolume(value);
    setIsMuted(value === 0);
    wavesurferRef.current?.setVolume(value);
  }, []);

  const toggleMute = React.useCallback(() => {
    if (!wavesurferRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    wavesurferRef.current.setVolume(next ? 0 : volume);
  }, [isMuted, volume]);

  const handleSeek = React.useCallback(
    ([v]: number[]) => {
      if (!wavesurferRef.current || !isReady) return;
      wavesurferRef.current.seekTo(v);
    },
    [isReady],
  );

  const toggleLoop = React.useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const removeActiveRegion = React.useCallback(() => {
    if (!activeRegionId || !regionsRef.current) return;
    const allRegions = regionsRef.current.getRegions();
    const active = allRegions.find((r) => r.id === activeRegionId);
    active?.remove();
  }, [activeRegionId]);

  const clearAllRegions = React.useCallback(() => {
    regionsRef.current?.clearRegions();
    setRegions([]);
    setActiveRegionId(null);
    setIsLooping(false);
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const progress = duration > 0 ? currentTime / duration : 0;

  // ── Render ─────────────────────────────────────────────────────────────
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

        {/* Waveform with regions */}
        <div className="relative w-full rounded-sm overflow-hidden bg-muted/40">
          {!isReady && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[2px]"
              style={{ height: waveHeight ?? 64 }}
            >
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
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
            onReady={handleReady}
            onPlay={handlePlay}
            onPause={handlePause}
            onFinish={handleFinish}
            onTimeupdate={handleTimeupdate}
            onSeeking={handleSeeking}
            onDestroy={handleDestroy}
          />
        </div>

        {/* Region info */}
        {regions.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {regions.length} region{regions.length !== 1 ? "s" : ""}
            {activeRegionId && (
              <>
                {" · "}
                <span className="font-medium text-foreground">
                  Active: {formatTime(regions.find((r) => r.id === activeRegionId)?.start ?? 0)}–
                  {formatTime(regions.find((r) => r.id === activeRegionId)?.end ?? 0)}
                </span>
              </>
            )}
          </p>
        )}

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

            {/* Loop active region */}
            <Button
              size="icon"
              variant={isLooping ? "default" : "ghost"}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={!isReady || !activeRegionId}
              onClick={toggleLoop}
              aria-label={isLooping ? "Stop looping" : "Loop active region"}
            >
              <Repeat size={15} />
            </Button>

            {/* Remove active region */}
            {editable && activeRegionId && (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={removeActiveRegion}
                aria-label="Remove active region"
              >
                <Trash2 size={15} />
              </Button>
            )}
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

        {/* Hint */}
        {editable && isReady && regions.length === 0 && (
          <p className="text-xs text-muted-foreground/60 text-center">
            Click and drag on the waveform to create a region
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default WaveRegions;
