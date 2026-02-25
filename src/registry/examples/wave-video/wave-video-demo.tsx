import { WaveVideo } from "@/registry/components/wave-video";

export default function WaveVideoDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <WaveVideo url="/coastline.mp4" videoProps={{ loop: true }} />
    </div>
  );
}
