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
  RotateCcw,
  Repeat,
  Trash2,
} from "lucide-react";
import WavesurferPlayer, { formatTime, useWavePlayer } from "@/lib/wave-cn";
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
  /** Default color for new regions @default "color-mix(in oklab, var(--primary) 25%, transparent)" */
  regionColor?: string;
  /** Color for the active (looping) region @default "color-mix(in oklab, var(--primary) 45%, transparent)" */
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

type RegionsPluginInstance = InstanceType<typeof RegionsPlugin>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  regionColor = "color-mix(in oklab, var(--primary) 25%, transparent)",
  activeRegionColor = "color-mix(in oklab, var(--primary) 45%, transparent)",
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
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
}: WaveRegionsProps) {
  const [regionsPlugin, setRegionsPlugin] =
    React.useState<RegionsPluginInstance | null>(null);
  const [regions, setRegions] = React.useState<RegionData[]>([]);
  const [activeRegionId, setActiveRegionId] = React.useState<string | null>(
    null,
  );
  const [isLooping, setIsLooping] = React.useState(false);

  // Latest props/state readable from plugin listeners without re-subscribing.
  const latest = React.useRef({
    editable,
    regionColor,
    activeRegionId,
    onRegionCreated,
    onRegionUpdated,
    onRegionRemoved,
    onRegionClicked,
  });
  React.useEffect(() => {
    latest.current = {
      editable,
      regionColor,
      activeRegionId,
      onRegionCreated,
      onRegionUpdated,
      onRegionRemoved,
      onRegionClicked,
    };
  });

  // ── Memoized plugin ──────────────────────────────────────────────────────
  const plugins = React.useMemo(
    () => (typeof document === "undefined" ? [] : [RegionsPlugin.create()]),
    [],
  );

  // ── Player ───────────────────────────────────────────────────────────────
  const player = useWavePlayer({
    defaultVolume,
    onPlay,
    onPause,
    onFinish,
    onTimeUpdate,
    onReady: (ws) => {
      const live = ws
        .getActivePlugins()
        .find((p) => p instanceof RegionsPlugin) as
        | RegionsPluginInstance
        | undefined;
      setRegionsPlugin(live ?? null);
    },
  });

  const handlers = React.useMemo(
    () => ({
      ...player.handlers,
      onDestroy: (ws: WaveSurfer) => {
        player.handlers.onDestroy?.(ws);
        setRegionsPlugin(null);
        setRegions([]);
        setActiveRegionId(null);
        setIsLooping(false);
      },
    }),
    [player.handlers],
  );

  // ── Drag selection ───────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!regionsPlugin || !editable) return;
    return regionsPlugin.enableDragSelection({
      color: regionColor,
      resize: true,
      drag: true,
    });
  }, [regionsPlugin, editable, regionColor]);

  // ── Region events ────────────────────────────────────────────────────────
  React.useEffect(() => {
    const rp = regionsPlugin;
    if (!rp) return;

    const unsubs = [
      rp.on("region-created", (region: Region) => {
        const { editable, regionColor, onRegionCreated } = latest.current;
        if (editable) {
          region.setOptions({ color: regionColor, resize: true, drag: true });
        }
        const data = toRegionData(region);
        setRegions((prev) => {
          if (prev.some((r) => r.id === data.id)) return prev;
          return [...prev, data];
        });
        onRegionCreated?.(data);
      }),

      rp.on("region-updated", (region: Region) => {
        const data = toRegionData(region);
        setRegions((prev) =>
          prev.map((r) => (r.id === data.id ? data : r)),
        );
        latest.current.onRegionUpdated?.(data);
      }),

      rp.on("region-removed", (region: Region) => {
        setRegions((prev) => prev.filter((r) => r.id !== region.id));
        setActiveRegionId((prev) => (prev === region.id ? null : prev));
        if (latest.current.activeRegionId === region.id) setIsLooping(false);
        latest.current.onRegionRemoved?.(region.id);
      }),

      rp.on("region-clicked", (region: Region, e: MouseEvent) => {
        e.stopPropagation();
        setActiveRegionId(region.id);
        latest.current.onRegionClicked?.(toRegionData(region));
      }),
    ];

    return () => unsubs.forEach((u) => u());
  }, [regionsPlugin]);

  // ── Loop active region ───────────────────────────────────────────────────
  React.useEffect(() => {
    const ws = player.wavesurfer.current;
    const rp = regionsPlugin;
    if (!ws || !rp || !isLooping || !activeRegionId) return;

    const active = rp.getRegions().find((r) => r.id === activeRegionId);
    if (!active) return;

    // Play the active region
    active.play();

    const unsub = rp.on("region-out", (region) => {
      if (region.id === active.id) active.play();
    });

    return () => unsub();
  }, [player.wavesurfer, regionsPlugin, isLooping, activeRegionId]);

  // ── Highlight active region ──────────────────────────────────────────────
  React.useEffect(() => {
    if (!regionsPlugin) return;
    regionsPlugin.getRegions().forEach((r) => {
      r.setOptions({
        color: r.id === activeRegionId ? activeRegionColor : regionColor,
      });
    });
  }, [regionsPlugin, activeRegionId, regionColor, activeRegionColor]);

  // ── Controls ─────────────────────────────────────────────────────────────

  const { seek, setVolume } = player;
  const handleSeek = React.useCallback(([v]: number[]) => seek(v), [seek]);
  const handleVolume = React.useCallback(
    ([v]: number[]) => setVolume(v),
    [setVolume],
  );

  const toggleLoop = React.useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const removeActiveRegion = React.useCallback(() => {
    if (!activeRegionId || !regionsPlugin) return;
    const active = regionsPlugin
      .getRegions()
      .find((r) => r.id === activeRegionId);
    active?.remove();
  }, [regionsPlugin, activeRegionId]);

  // ── Derived ──────────────────────────────────────────────────────────────
  const { isReady, isPlaying, isMuted, volume, currentTime, duration, progress } =
    player;
  const activeRegion = activeRegionId
    ? regions.find((r) => r.id === activeRegionId)
    : undefined;

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
            {...handlers}
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
                  Active: {formatTime(activeRegion?.start ?? 0)}–
                  {formatTime(activeRegion?.end ?? 0)}
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
