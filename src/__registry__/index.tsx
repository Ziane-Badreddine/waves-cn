// @ts-nocheck
import * as React from "react";

export const Index: Record<string, any> = {
  "wave-cn": {
    name: "wave-cn",
    description:
      "Shared wave utilities and configuration used across wave components.",
    type: "registry:lib",
    files: ["src/registry/lib/wave-cn.tsx"],
    component: React.lazy(() => import("@/registry/lib/wave-cn.tsx")),
    category: "wave",
    subcategory: "utility",
    chunks: [],
  },
  "wave-player": {
    name: "wave-player",
    description: "Shadcn wave player",
    type: "registry:component",
    files: ["src/registry/components/wave-player.tsx"],
    component: React.lazy(() => import("@/registry/components/wave-player")),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-player-demo": {
    name: "wave-player-demo",
    description: "Shadcn wave player",
    type: "registry:example",
    files: ["src/registry/examples/wave-player/wave-player-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-player/wave-player-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-player-custom": {
    name: "wave-player-custom",
    description: "Shadcn wave player with custom waveform style",
    type: "registry:examples",
    files: ["src/registry/examples/wave-player/wave-player-custom-example.tsx"],
    component: React.lazy(
      () =>
        import("@/registry/examples/wave-player/wave-player-custom-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-player-minimal": {
    name: "wave-player-minimal",
    description: "Shadcn wave player minimal (no title)",
    type: "registry:examples",
    files: [
      "src/registry/examples/wave-player/wave-player-minimal-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/wave-player/wave-player-minimal-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-player-with-title": {
    name: "wave-player-with-title",
    description: "Shadcn wave player with title",
    type: "registry:examples",
    files: [
      "src/registry/examples/wave-player/wave-player-with-title-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/wave-player/wave-player-with-title-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  // 🎤 RECORDER CORE
  "wave-recorder": {
    name: "wave-recorder",
    description: "Voice message recorder",
    type: "registry:component",
    files: ["src/registry/components/wave-recorder.tsx"],
    component: React.lazy(() => import("@/registry/components/wave-recorder")),
    category: "wave",
    subcategory: "recorder",
    chunks: [],
  },

  // 🎬 DEMO
  "wave-recorder-demo": {
    name: "wave-recorder-demo",
    description: "wave recorder demo",
    type: "registry:example",
    files: ["src/registry/examples/wave-recorder/wave-recorder-demo.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-recorder/wave-recorder-demo"),
    ),
    category: "wave",
    subcategory: "recorder",
    chunks: [],
  },

  // 🎤 MINIMAL
  "wave-recorder-minimal": {
    name: "wave-recorder-minimal",
    description: "Minimal voice recorder",
    type: "registry:example",
    files: ["src/registry/examples/wave-recorder/wave-recorder-minimal.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-recorder/wave-recorder-minimal"),
    ),
    category: "wave",
    subcategory: "recorder",
    chunks: [],
  },

  // ⏱ TIMED
  "wave-recorder-timed": {
    name: "wave-recorder-timed",
    description: "Timed voice recorder",
    type: "registry:example",
    files: ["src/registry/examples/wave-recorder/wave-recorder-timed.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-recorder/wave-recorder-timed"),
    ),
    category: "wave",
    subcategory: "recorder",
    chunks: [],
  },

  // 🌊 CUSTOM WAVE
  "wave-recorder-custom-wave": {
    name: "wave-recorder-custom-wave",
    description: "Custom waveform voice recorder",
    type: "registry:example",
    files: [
      "src/registry/examples/wave-recorder/wave-recorder-custom-wave.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/wave-recorder/wave-recorder-custom-wave"),
    ),
    category: "wave",
    subcategory: "recorder",
    chunks: [],
  },

  "wave-timeline": {
    name: "wave-timeline",
    description: "Shadcn wave timeline",
    type: "registry:component",
    files: ["src/registry/components/wave-timeline.tsx"],
    component: React.lazy(() => import("@/registry/components/wave-timeline")),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-timeline-demo": {
    name: "wave-timeline-demo",
    description: "Shadcn wave timeline demo",
    type: "registry:component",
    files: ["src/registry/examples/wave-timeline/wave-timeline-example.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-timeline/wave-timeline-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-timeline-dual": {
    name: "wave-timeline-dual",
    description: "wave timeline with both top and bottom rulers",
    type: "registry:component",
    files: [
      "src/registry/examples/wave-timeline/wave-timeline-dual-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/wave-timeline/wave-timeline-dual-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-timeline-no-ruler": {
    name: "wave-timeline-no-ruler",
    description: "wave timeline without ruler",
    type: "registry:component",
    files: [
      "src/registry/examples/wave-timeline/wave-timeline-no-ruler-example.tsx",
    ],
    component: React.lazy(
      () =>
        import("@/registry/examples/wave-timeline/wave-timeline-no-ruler-example"),
    ),
    category: "wave",
    subcategory: "player",
    chunks: [],
  },

  "wave-speed": {
    name: "wave-speed",
    description: "wave player with variable playback speed control",
    type: "registry:component",
    files: ["src/registry/components/wave-speed.tsx"],
    component: React.lazy(() => import("@/registry/components/wave-speed")),
    category: "wave",
    subcategory: "speed",
    chunks: [],
  },

  "wave-speed-demo": {
    name: "wave-speed-demo",
    description: "wave speed demo",
    type: "registry:example",
    files: ["src/registry/examples/wave-speed/wave-speed-demo.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-speed/wave-speed-demo"),
    ),
    category: "wave",
    subcategory: "speed",
    chunks: [],
  },

  "wave-speed-podcast": {
    name: "wave-speed-podcast",
    description: "wave speed player with podcast range (0.5x–2x)",
    type: "registry:example",
    files: ["src/registry/examples/wave-speed/wave-speed-podcast.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-speed/wave-speed-podcast"),
    ),
    category: "wave",
    subcategory: "speed",
    chunks: [],
  },

  "wave-speed-custom-wave": {
    name: "wave-speed-custom-wave",
    description: "wave speed player with custom colors",
    type: "registry:example",
    files: ["src/registry/examples/wave-speed/wave-speed-custom-wave.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-speed/wave-speed-custom-wave"),
    ),
    category: "wave",
    subcategory: "speed",
    chunks: [],
  },

  "wave-zoom": {
    name: "wave-zoom",
    description: "Wave player with mouse-wheel zoom (ZoomPlugin)",
    type: "registry:component",
    files: ["src/registry/components/wave-zoom.tsx"],
    component: React.lazy(() => import("@/registry/components/wave-zoom")),
    category: "wave",
    subcategory: "zoom",
    chunks: [],
  },

  // 🎬 DEMO
  "wave-zoom-demo": {
    name: "wave-zoom-demo",
    description: "Wave zoom demo",
    type: "registry:example",
    files: ["src/registry/examples/wave-zoom/wave-zoom-demo.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-zoom/wave-zoom-demo"),
    ),
    category: "wave",
    subcategory: "zoom",
    chunks: [],
  },

  "wave-zoom-custom-wave": {
    name: "wave-zoom-custom-wave",
    description: "Wave zoom with custom waveform styling",
    type: "registry:example",
    files: ["src/registry/examples/wave-zoom/wave-zoom-custom-wave.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-zoom/wave-zoom-custom-wave"),
    ),
    category: "wave",
    subcategory: "zoom",
    chunks: [],
  },

  "wave-zoom-custom-range": {
    name: "wave-zoom-custom-range",
    description: "Wave zoom with custom zoom configuration",
    type: "registry:example",
    files: ["src/registry/examples/wave-zoom/wave-zoom-custom-range.tsx"],
    component: React.lazy(
      () => import("@/registry/examples/wave-zoom/wave-zoom-custom-range"),
    ),
    category: "wave",
    subcategory: "zoom",
    chunks: [],
  },
};
