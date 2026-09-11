import WaveRegions from "@/registry/components/wave-regions";

export default function WaveRegionsDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveRegions
        src="/coastline.mp3"
        title="Interactive Regions"
      />
    </div>
  );
}
