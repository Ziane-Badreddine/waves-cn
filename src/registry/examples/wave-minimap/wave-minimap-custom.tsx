import WaveMinimap from "@/registry/components/wave-minimap";

export default function WaveMinimapCustomDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveMinimap
        src="/coastline.mp3"
        title="Custom Minimap"
        minimapHeight={40}
        minimapWaveColor="var(--chart-2)"
        minimapProgressColor="var(--chart-1)"
        overlayColor="color-mix(in oklab, var(--foreground) 10%, transparent)"
      />
    </div>
  );
}
