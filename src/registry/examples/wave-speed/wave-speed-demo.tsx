import { WaveSpeed } from "@/registry/components/wave-speed";

export default function WaveSpeedDemo() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveSpeed url="/coastline.mp3" />
    </div>
  );
}
