import WavePlayer from "@/registry/components/wave-player";

export default function AudioPlayerMinimalDemo() {
  return (
    <div className="w-full  mx-auto p-6">
      <WavePlayer src="/coastline.mp3" />
    </div>
  );
}
