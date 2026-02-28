import WaveTimeline from "@/registry/components/wave-timeline";

export default function AudioTimelineDemo() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveTimeline src="/coastline.mp3" title="SoundHelix — Song 1" />;
    </div>
  );
}
