import WaveMinimap from "@/registry/components/wave-minimap";

export default function WaveMinimapDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveMinimap
        src="/coastline.mp3"
        title="Minimap Navigation"
      />
    </div>
  );
}
