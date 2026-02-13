"use client"

import * as React from "react"
import WaveSurfer from "wavesurfer.js"


import { Card, CardContent } from "@/components/ui/card"

import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  src: string
  className?: string
}

export default function AudioPlayer({ src, className }: AudioPlayerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const waveRef = React.useRef<WaveSurfer | null>(null)

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [duration, setDuration] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)

  // 🎧 Init wavesurfer
  React.useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 64,
      waveColor: "hsl(var(--muted-foreground))",
      progressColor: "hsl(var(--primary))",
      cursorColor: "hsl(var(--primary))",
      barWidth: 2,
      barGap: 2,
      url: src,
      fetchParams: {
        mode: "cors", // ✅ CORS safe
      },
    })

    waveRef.current = ws

    ws.on("ready", () => {
      setDuration(ws.getDuration())
    })

    ws.on("audioprocess", () => {
      setCurrentTime(ws.getCurrentTime())
    })

    ws.on("finish", () => {
      setIsPlaying(false)
    })

    return () => {
      ws.destroy()
    }
  }, [src])

  // ▶️ Play / Pause
  const togglePlay = () => {
    if (!waveRef.current) return
    waveRef.current.playPause()
    setIsPlaying(waveRef.current.isPlaying())
  }

  // 🔊 Volume
  const handleVolume = (v: number[]) => {
    const value = v[0]
    setVolume(value)
    waveRef.current?.setVolume(value)
  }

  // ⏱ Format time
  const format = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">

        {/* Waveform */}
        <div ref={containerRef} className="w-full" />

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <Button size="icon" variant="secondary" onClick={togglePlay}>
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>

            <span className="text-xs text-muted-foreground w-[70px]">
              {format(currentTime)} / {format(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 w-[140px]">
            <Volume2 size={16} />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolume}
            />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
