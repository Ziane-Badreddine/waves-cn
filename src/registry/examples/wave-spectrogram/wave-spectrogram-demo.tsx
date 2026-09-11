import WaveSpectrogram from "@/registry/components/wave-spectrogram";

export default function WaveSpectrogramDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveSpectrogram
        src="/coastline.mp3"
        title="Spectrogram View"
      />
    </div>
  );
}
