"use client"

import AudioTimeline from "@/registry/components/audio-timeline"

export default function AudioTimelineNoRulerExample() {
  return (
    <AudioTimeline
      src="/coastline.mp3"
      title="No Ruler"
      topTimeline={false}
    />
  )
}