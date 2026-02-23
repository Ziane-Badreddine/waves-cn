import AudioPlayer from "@/registry/components/audio-player";

export default function AudioPlayerCustomDemo() {
return (
  <AudioPlayer
    src="/coastline.mp3"
    title="Custom Waveform Style"
    waveHeight={80}
    barWidth={4}
    barGap={3}
    barRadius={4}
    defaultVolume={0.6}
  />
)
}