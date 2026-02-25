import { WaveVideo } from "@/registry/components/wave-video";

export default function WaveVideoCustomWave() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <WaveVideo
        url="/coastline.mp4"
        waveColor="var(--chart-1)"
        progressColor="var(--chart-2)"
        barWidth={4}
        barGap={3}
        barRadius={8}
        waveHeight={80}
        videoProps={{ controls: true }}
      />
    </div>
  );
}
