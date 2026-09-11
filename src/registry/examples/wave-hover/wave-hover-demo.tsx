import WaveHover from "@/registry/components/wave-hover";

export default function WaveHoverDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveHover
        src="/coastline.mp3"
        title="Hover Cursor"
      />
    </div>
  );
}
