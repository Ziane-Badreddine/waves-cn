"use client";

import { WaveZoom } from "@/registry/components/wave-zoom";

export default function WaveZoomDemo() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveZoom url="/coastline.mp3" />
    </div>
  );
}
