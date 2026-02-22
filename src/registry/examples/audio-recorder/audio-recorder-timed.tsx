"use client";

import React from "react";
import AudioRecorder from "@/registry/components/audio-recorder";

export default function AudioRecorderTimed() {
  return (
    <AudioRecorder
      maxDuration={10}
      onRecordEnd={(blob) => {
        console.log("Timed:", blob);
      }}
    />
  );
}
