"use client";

import React from "react";
import AudioRecorder from "@/registry/components/audio-recorder";

export default function AudioRecorderDemo() {
  return (
    <AudioRecorder
      onRecordEnd={(blob) => {
        const url = URL.createObjectURL(blob);
        console.log(blob, url);
      }}
    />
  );
}
