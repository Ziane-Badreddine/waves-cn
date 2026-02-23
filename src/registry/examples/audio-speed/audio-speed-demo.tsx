import { AudioSpeed } from "@/registry/components/audio-speed";

export default function AudioSpeedDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <AudioSpeed url="/coastline.mp3" />
    </div>
  );
}
