import WaveEnvelope from "@/registry/components/wave-envelope";

export default function WaveEnvelopeDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveEnvelope
        src="/coastline.mp3"
        title="Volume Automation"
      />
    </div>
  );
}
