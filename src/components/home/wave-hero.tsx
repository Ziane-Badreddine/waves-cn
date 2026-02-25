"use client";

import WavesurferPlayer from "@/registry/lib/wave-cn";

export default function WaveHero() {
  return (
    <WavesurferPlayer
      url="/coastline.mp3"
      height={100}
      barWidth={2}
      barGap={1}
      barRadius={1}
      className="  bottom-1/2 left-0 w-full px-4 md:px-6  "
      onInteraction={(ws) => ws.play()}
    />
  );
}
