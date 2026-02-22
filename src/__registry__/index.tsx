// @ts-nocheck
import * as React from "react";

export const Index: Record<string, any> = {
  "audio-player": {
    name: "audio-player",
    description: "Shadcn audio player",
    type: "registry:component",
    files: ["src/registry/examples/audio-player-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-player-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-player-custom": {
    name: "audio-player-custom",
    description: "Shadcn audio player with custom waveform style",
    type: "registry:component",
    files: ["src/registry/examples/audio-player-custom-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-player-custom-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-player-minimal": {
    name: "audio-player-minimal",
    description: "Shadcn audio player minimal (no title)",
    type: "registry:component",
    files: ["src/registry/examples/audio-player-minimal-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-player-minimal-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  // 🎤 RECORDER CORE
  "audio-recorder": {
    name: "audio-recorder",
    description: "Voice message recorder",
    type: "registry:component",
    files: ["src/registry/components/audio-recorder.tsx"],
    component: React.lazy(() => import("@/registry/components/audio-recorder")),
    category: "audio",
    subcategory: "recorder",
    chunks: [],
  },

  // 🎬 DEMO
  "audio-recorder-demo": {
    name: "audio-recorder-demo",
    description: "Audio recorder demo",
    type: "registry:example",
    files: ["src/registry/examples/audio-recorder/audio-recorder-demo.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-recorder/audio-recorder-demo"),
    ),
    category: "audio",
    subcategory: "recorder",
    chunks: [],
  },

  // 🎤 MINIMAL
  "audio-recorder-minimal": {
    name: "audio-recorder-minimal",
    description: "Minimal voice recorder",
    type: "registry:example",
    files: ["src/registry/examples/audio-recorder/audio-recorder-minimal.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-recorder/audio-recorder-minimal"),
    ),
    category: "audio",
    subcategory: "recorder",
    chunks: [],
  },

  // ⏱ TIMED
  "audio-recorder-timed": {
    name: "audio-recorder-timed",
    description: "Timed voice recorder",
    type: "registry:example",
    files: ["src/registry/examples/audio-recorder/audio-recorder-timed.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-recorder/audio-recorder-timed"),
    ),
    category: "audio",
    subcategory: "recorder",
    chunks: [],
  },

  // 🌊 CUSTOM WAVE
  "audio-recorder-custom-wave": {
    name: "audio-recorder-custom-wave",
    description: "Custom waveform voice recorder",
    type: "registry:example",
    files: [
      "src/registry/examples/audio-recorder/audio-recorder-custom-wave.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/audio-recorder/audio-recorder-custom-wave"),
    ),
    category: "audio",
    subcategory: "recorder",
    chunks: [],
  },
};
