"use client";

import React from "react";
import AudioRecorder from "@/registry/components/audio-recorder";

export default function AudioRecorderCustomWave() {
  return (
    <AudioRecorder
      waveColor="#7c3aed"
      progressColor="#ffffff"
      waveformHeight={80}
      barWidth={4}
      barGap={2}
      barRadius={8}
      barHeight={0.9}
      className="rounded-xl border p-4 bg-muted/40"
      onRecordEnd={(blob) => {
        console.log("Custom:", blob);
      }}
    />
  );
}
