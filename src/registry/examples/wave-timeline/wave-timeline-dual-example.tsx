import WaveTimeline from "@/registry/components/wave-timeline";

export default function AudioTimelineDualDemo() {
  return (
    <WaveTimeline
      src="/coastline.mp3"
      title="Dual Timeline"
      topTimeline={{ height: 20, primaryLabelInterval: 5, timeInterval: 0.5 }}
      bottomTimeline={{
        height: 14,
        primaryLabelInterval: 1,
        timeInterval: 0.1,
      }}
    />
  );
}
