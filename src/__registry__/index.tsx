// @ts-nocheck
import * as React from "react";

export const Index: Record<string, any> = {
  "audio-player": {
    name: "audio-player",
    description: "Shadcn audio player",
    type: "registry:component",
    files: ["src/registry/components/audio-player.tsx"],
    component: React.lazy(() => import("@/registry/components/audio-player")),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-player-demo": {
    name: "audio-player-demo",
    description: "Shadcn audio player",
    type: "registry:example",
    files: ["src/registry/examples/audio-player/audio-player-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-player/audio-player-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-player-custom": {
    name: "audio-player-custom",
    description: "Shadcn audio player with custom waveform style",
    type: "registry:examples",
    files: [
      "src/registry/examples/audio-player/audio-player-custom-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/audio-player/audio-player-custom-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-player-minimal": {
    name: "audio-player-minimal",
    description: "Shadcn audio player minimal (no title)",
    type: "registry:examples",
    files: [
      "src/registry/examples/audio-player/audio-player-minimal-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/audio-player/audio-player-minimal-example"),
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

  "audio-timeline": {
    name: "audio-timeline",
    description: "Shadcn audio timeline",
    type: "registry:component",
    files: ["src/registry/examples/audio-timeline/audio-timeline-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-timeline/audio-timeline-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-timeline-dual": {
    name: "audio-timeline-dual",
    description: "Audio timeline with both top and bottom rulers",
    type: "registry:component",
    files: [
      "src/registry/examples/audio-timeline/audio-timeline-dual-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/audio-timeline/audio-timeline-dual-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "audio-timeline-no-ruler": {
    name: "audio-timeline-no-ruler",
    description: "Audio timeline without ruler",
    type: "registry:component",
    files: [
      "src/registry/examples/audio-timeline/audio-timeline-no-ruler-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/audio-timeline/audio-timeline-no-ruler-example"),
    ),
    category: "audio",
    subcategory: "player",
    chunks: [],
  },

  "use-wavesurfe": {
    name: "use-wavesurfe",
    description:
      "useWavesurfer hook with shared defaults — base for all audio components",
    type: "registry:hook",
    files: ["src/registry/hooks/use-wavesurfe.tsx"],
    component: React.lazy(() => import("@/registry/hooks/use-wavesurfe")),
    category: "audio",
    subcategory: "hook",
    chunks: [],
  },

  "audio-speed": {
    name: "audio-speed",
    description: "Audio player with variable playback speed control",
    type: "registry:component",
    files: ["src/registry/components/audio-speed.tsx"],
    component: React.lazy(() => import("@/registry/components/audio-speed")),
    category: "audio",
    subcategory: "speed",
    chunks: [],
  },

  "audio-speed-demo": {
    name: "audio-speed-demo",
    description: "Audio speed demo",
    type: "registry:example",
    files: ["src/registry/examples/audio-speed/audio-speed-demo.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-speed/audio-speed-demo"),
    ),
    category: "audio",
    subcategory: "speed",
    chunks: [],
  },

  "audio-speed-podcast": {
    name: "audio-speed-podcast",
    description: "Audio speed player with podcast range (0.5x–2x)",
    type: "registry:example",
    files: ["src/registry/examples/audio-speed/audio-speed-podcast.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-speed/audio-speed-podcast"),
    ),
    category: "audio",
    subcategory: "speed",
    chunks: [],
  },

  "audio-speed-custom-wave": {
    name: "audio-speed-custom-wave",
    description: "Audio speed player with custom colors",
    type: "registry:example",
    files: ["src/registry/examples/audio-speed/audio-speed-custom-wave.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/audio-speed/audio-speed-custom-wave"),
    ),
    category: "audio",
    subcategory: "speed",
    chunks: [],
  },
};
