import WaveTimeline from "@/registry/components/wave-timeline";

export default function AudioTimelineNoRulerExample() {
  return (
    <WaveTimeline 
      src="/coastline.mp3" 
      title="No Ruler" 
      topTimeline={false} 
    />
  );
}
