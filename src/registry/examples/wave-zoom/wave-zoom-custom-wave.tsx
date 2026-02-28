"use client";

import { WaveZoom } from "@/registry/components/wave-zoom";

export default function WaveZoomCustomWave() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveZoom
        url="/coastline.mp3"
        waveColor="var(--chart-1)"
        progressColor="var(--chart-2)"
        barWidth={4}
        barGap={3}
        barRadius={8}
      />
    </div>
  );
}
