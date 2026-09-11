import WaveHover from "@/registry/components/wave-hover";

export default function WaveHoverCustomDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveHover
        src="/coastline.mp3"
        title="Custom Hover Style"
        lineColor="red"
        lineWidth={2}
        labelBackground="red"
        labelColor="white"
      />
    </div>
  );
}
