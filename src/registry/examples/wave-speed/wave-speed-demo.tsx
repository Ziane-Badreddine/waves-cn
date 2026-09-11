import { WaveSpeed } from "@/registry/components/wave-speed";

export default function WaveSpeedDemo() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveSpeed src="/coastline.mp3" />
    </div>
  );
}
