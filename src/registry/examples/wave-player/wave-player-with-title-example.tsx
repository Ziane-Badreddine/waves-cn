import WavePlayer from "@/registry/components/wave-player";

export default function AudioPlayerWithTitleDemo() {
  return (
    <div className="w-full  mx-auto p-6">
      <WavePlayer src="/coastline.mp3" title="Coastline" />
    </div>
  );
}
