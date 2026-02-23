import { AudioSpeed } from "@/registry/components/audio-speed";

export default function AudioSpeedCustomWave() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <AudioSpeed
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
