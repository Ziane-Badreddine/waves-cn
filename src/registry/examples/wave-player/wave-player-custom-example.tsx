import WavePlayer from "@/registry/components/wave-player";

export default function AudioPlayerCustomDemo() {
  return (
    <WavePlayer
      src="/coastline.mp3"
      title="Custom Waveform Style"
      waveHeight={80}
      barWidth={4}
      barGap={3}
      barRadius={4}
      defaultVolume={0.6}
    />
  );
}
