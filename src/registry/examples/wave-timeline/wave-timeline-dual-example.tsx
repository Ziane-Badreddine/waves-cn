import AudioTimeline from "@/registry/components/wave-timeline";

export default function AudioTimelineDualDemo() {
  return (
    <AudioTimeline
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
