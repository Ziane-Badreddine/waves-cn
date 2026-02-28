"use client";

import { WaveZoom } from "@/registry/components/wave-zoom";

export default function WaveZoomCustomRange() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveZoom
        url="/coastline.mp3"
        zoomScale={0.25}
        maxZoom={500}
        defaultZoom={50}
      />
    </div>
  );
}
