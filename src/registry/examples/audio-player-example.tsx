"use client"

import { useWavesurfer } from "@/components/cors/wavesurfer-player"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"

export default function AudioPlayerExample() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    url: "/coastline.mp3",
    waveColor: "oklch(0.2300 0 0)",
    progressColor: "oklch(1 0 0)",
    height: 100,
  })

  const onPlayPause = () => {
    wavesurfer?.playPause()
  }

  return (
    <div className="w-full space-y-4">
      {/* Waveform */}
      <div ref={containerRef} />

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
