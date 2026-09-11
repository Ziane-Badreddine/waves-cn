import WaveMinimap from "@/registry/components/wave-minimap";

export default function WaveMinimapCustomDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveMinimap
        src="/coastline.mp3"
        title="Custom Minimap"
        minimapHeight={40}
        minimapWaveColor="rgba(59,130,246,0.3)"
        minimapProgressColor="rgba(59,130,246,0.8)"
        overlayColor="rgba(0,0,0,0.1)"
      />
    </div>
  );
}
