// @ts-nocheck
import * as React from "react"

export const Index: Record<string, any> = {


    "test": {
    name: "audio-player",
    description: "Shadcn audio player",
    type: "registry:component",
    files: ["src/registry/examples/test.tsx"],
    component: React.lazy(() => import("@/registry/examples/test")),
    category: "audio",
    subcategory: "player",
    chunks: []
  },


  "audio-player": {
    name: "audio-player",
    description: "Shadcn audio player",
    type: "registry:component",
    files: ["src/registry/examples/audio-player-example.tsx"],
    component: React.lazy(() => import("@/registry/examples/audio-player-example")),
    category: "audio",
    subcategory: "player",
    chunks: []
  },

  // 🎤 AUDIO RECORDER
  "audio-recorder": {
    name: "audio-recorder",
    description: "Voice message recorder",
    type: "registry:component",
    files: ["src/registry/components/audio-recorder.tsx"],
    component: React.lazy(() => import("@/registry/components/audio-recorder")),
    category: "audio",
    subcategory: "recorder",
    chunks: []
  },

  "audio-player-custom": {
    name: "audio-player-custom",
    description: "Shadcn audio player with custom waveform style",
    type: "registry:component",
    files: ["src/registry/examples/audio-player-custom-example.tsx"],
    component: React.lazy(() => import("@/registry/examples/audio-player-custom-example")),
    category: "audio",
    subcategory: "player",
    chunks: []
  },

  "audio-player-minimal": {
    name: "audio-player-minimal",
    description: "Shadcn audio player minimal (no title)",
    type: "registry:component",
    files: ["src/registry/examples/audio-player-minimal-example.tsx"],
    component: React.lazy(() => import("@/registry/examples/audio-player-minimal-example")),
    category: "audio",
    subcategory: "player",
    chunks: []
  },

 
}
