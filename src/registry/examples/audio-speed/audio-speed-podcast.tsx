import { AudioSpeed } from "@/registry/components/audio-speed";

export default function AudioSpeedPodcast() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <AudioSpeed
        url="/coastline.mp3"
        minSpeed={0.5}
        maxSpeed={2}
        defaultSpeed={1}
        step={0.25}
      />
    </div>
  );
}
