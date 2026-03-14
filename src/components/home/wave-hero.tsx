"use client";

import { useState } from "react";
import WavesurferPlayer from "@/lib/wave-cn";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function WaveHero() {
  const [isReady, setIsReady] = useState(false);
  return (
    <div className="relative bottom-1/2 left-0 w-full px-4 md:px-6">
      {!isReady && (
        <Skeleton className="absolute inset-0 w-full" style={{ height: 100 }} />
      )}
      <WavesurferPlayer
        url="/coastline.mp3"
        height={100}
        barWidth={2}
        barGap={1}
        barRadius={1}
        onReady={() => setIsReady(true)}
        onLoad={() => setIsReady(false)}
        onInteraction={(ws) => ws.play()}
        dragToSeek={true}
        onFinish={(ws) => ws.setTime(0)}
      />
    </div>
  );
}
