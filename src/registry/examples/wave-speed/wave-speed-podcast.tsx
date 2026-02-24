import { WaveSpeed } from "@/registry/components/wave-speed";

export default function WaveSpeedPodcast() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveSpeed
        url="/coastline.mp3"
        minSpeed={0.5}
        maxSpeed={2}
        defaultSpeed={1}
        step={0.25}
      />
    </div>
  );
}
