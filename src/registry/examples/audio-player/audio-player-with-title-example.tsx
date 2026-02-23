import AudioPlayer from "@/registry/components/audio-player"


export default function AudioPlayerWithTitleDemo() {
  return (
    <AudioPlayer
      src="/coastline.mp3"
      title="Coastline"
    />
  )
}