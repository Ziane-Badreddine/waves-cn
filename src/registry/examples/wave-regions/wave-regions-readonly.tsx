import WaveRegions from "@/registry/components/wave-regions";

export default function WaveRegionsReadonlyDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveRegions
        src="/coastline.mp3"
        title="Readonly Regions"
        editable={false}
      />
    </div>
  );
}
