import WaveTimeline from "@/registry/components/wave-timeline";

export default function WaveTimelineNoRulerExample() {
  return (
    <div className="w-full  mx-auto p-6">
      <WaveTimeline src="/coastline.mp3" title="No Ruler" topTimeline={false} />
    </div>
  );
}
