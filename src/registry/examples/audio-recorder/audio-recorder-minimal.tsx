"use client";

import React from "react";
import AudioRecorder from "@/registry/components/audio-recorder";

export default function AudioRecorderMinimal() {
  return (
    <AudioRecorder
      showWaveform={false}
      showTimer={false}
      onRecordEnd={(blob) => {
        console.log("Minimal:", blob);
      }}
    />
  );
}
