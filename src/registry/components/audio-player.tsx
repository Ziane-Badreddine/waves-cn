"use client"

import * as React from "react"
import WaveSurfer from "wavesurfer.js"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Loader2, RotateCcw } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AudioPlayerProps {
  /** Audio source URL */
  src: string
  /** Optional title shown above the waveform */
  title?: string
  /** Initial volume (0–1) */
  defaultVolume?: number
  /** Waveform bar width in px */
  barWidth?: number
  /** Waveform bar gap in px */
  barGap?: number
  /** Rounded borders for bars */
  barRadius?: number
  /** Waveform height in px */
  waveHeight?: number
  /** Minimum pixels per second (zoom level) */
  minPxPerSec?: number
  /** Autoplay on mount */
  autoPlay?: boolean
  /** Called when playback starts */
  onPlay?: () => void
  /** Called when playback pauses */
  onPause?: () => void
  /** Called when playback finishes */
  onFinish?: () => void
  /** Called with current time on every audio process tick */
  onTimeUpdate?: (currentTime: number, duration: number) => void
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(t: number): string {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Resolves a Tailwind/shadcn utility class to a real computed color string.
 * Works with any color format: hsl(), oklch(), rgb(), etc.
 *
 * We apply the class to a hidden <div>, mount it, read getComputedStyle().color,
 * then remove it. This always returns a resolved "rgb(...)" value that WaveSurfer
 * (which uses Canvas) can consume directly — unlike CSS variables which may be
 * raw channel values (e.g. "220 14% 96%") that Canvas cannot parse.
 */
function resolveColorClass(twClass: string): string {
  const el = document.createElement("div")
  el.className = twClass
  el.style.cssText = "position:fixed;pointer-events:none;opacity:0"
  document.body.appendChild(el)
  const color = getComputedStyle(el).color
  document.body.removeChild(el)
  return color || "rgb(100,100,100)"
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AudioPlayer({
  src,
  title,
  defaultVolume = 0.8,
  barWidth = 3,
  barGap = 2,
  barRadius = 2,
  waveHeight = 64,
  minPxPerSec = 1,
  autoPlay = false,
  onPlay,
  onPause,
  onFinish,
  onTimeUpdate,
  className,
}: AudioPlayerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const waveRef = React.useRef<WaveSurfer | null>(null)

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isReady, setIsReady] = React.useState(false)
  const [volume, setVolume] = React.useState(defaultVolume)
  const [isMuted, setIsMuted] = React.useState(false)
  const [duration, setDuration] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)

  // ── Init ──────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!containerRef.current) return

    setIsLoading(true)
    setIsReady(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)

    // Resolve shadcn Tailwind classes → real browser-computed colors.
    // We use text-* classes because getComputedStyle().color is always fully
    // resolved by the browser, unlike reading CSS variables directly which
    // may return raw channel values (e.g. "220 14% 96%") Canvas can't parse.
    const waveColor     = resolveColorClass("text-muted-foreground")
    const progressColor = resolveColorClass("text-primary")
    const cursorColor   = resolveColorClass("text-primary")

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: waveHeight,
      waveColor,
      progressColor,
      cursorColor,
      cursorWidth: 2,
      barWidth,
      barGap,
      barRadius,
      minPxPerSec,
      fillParent: true,
      url: src,
      autoplay: autoPlay,
      interact: true,
      dragToSeek: true,
      hideScrollbar: true,
      audioRate: 1,
      normalize: false,
    })

    waveRef.current = ws
    ws.setVolume(defaultVolume)

    ws.on("loading", () => setIsLoading(true))

    ws.on("ready", () => {
      setDuration(ws.getDuration())
      setIsLoading(false)
      setIsReady(true)
    })

    ws.on("audioprocess", () => {
      const t = ws.getCurrentTime()
      setCurrentTime(t)
      onTimeUpdate?.(t, ws.getDuration())
    })

    // fires when user clicks or drags the waveform natively
    ws.on("seeking", () => {
      setCurrentTime(ws.getCurrentTime())
    })

    ws.on("play", () => {
      setIsPlaying(true)
      onPlay?.()
    })

    ws.on("pause", () => {
      setIsPlaying(false)
      onPause?.()
    })

    ws.on("finish", () => {
      setIsPlaying(false)
      onFinish?.()
    })

    return () => ws.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // ── Controls ──────────────────────────────────────────────────────────────

  const togglePlay = () => waveRef.current?.playPause()

  const restart = () => {
    if (!waveRef.current || !isReady) return
    waveRef.current.setTime(0)   // setTime() from WaveSurfer docs
    waveRef.current.play()
  }

  const handleVolume = (v: number[]) => {
    const value = v[0]
    setVolume(value)
    setIsMuted(value === 0)
    waveRef.current?.setVolume(value)
  }

  const toggleMute = () => {
    if (!waveRef.current) return
    const next = !isMuted
    setIsMuted(next)
    waveRef.current.setVolume(next ? 0 : volume)
  }

  const progress = duration > 0 ? currentTime / duration : 0

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4 space-y-3">

        {/* Title */}
        {title && (
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
        )}

        {/* Waveform — WaveSurfer mounts its <canvas> inside this div */}
        <div className="relative w-full rounded-sm overflow-hidden">
          {isLoading && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-[2px]"
              style={{ height: waveHeight }}
            >
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <div ref={containerRef} className="w-full" />
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
            onValueChange={([v]) => {
              if (!waveRef.current || !isReady) return
              waveRef.current.seekTo(v) // seekTo(0–1) per WaveSurfer docs
            }}
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
  )
}

export default AudioPlayer