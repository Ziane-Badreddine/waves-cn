import { WaveSpeed } from "@/registry/components/wave-speed";

export default function WaveSpeedCustomWave() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveSpeed
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
