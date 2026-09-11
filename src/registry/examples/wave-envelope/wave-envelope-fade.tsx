import WaveEnvelope from "@/registry/components/wave-envelope";

export default function WaveEnvelopeFadeDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveEnvelope
        src="/coastline.mp3"
        title="Fade In & Out"
        fadeInEnd={5}
        fadeOutStart={25}
      />
    </div>
  );
}
