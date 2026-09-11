import WaveSpectrogram from "@/registry/components/wave-spectrogram";

export default function WaveSpectrogramHiresDemo() {
  return (
    <div className="w-full mx-auto p-6">
      <WaveSpectrogram
        src="/coastline.mp3"
        title="High-Res Spectrogram"
        fftSamples={2048}
        spectrogramHeight={200}
      />
    </div>
  );
}
