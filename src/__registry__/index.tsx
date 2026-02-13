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


  // // 🎧 AUDIO PLAYER
  // "audio-player": {
  //   name: "audio-player",
  //   description: "Shadcn audio player",
  //   type: "registry:component",
  //   files: ["src/registry/components/audio-player.tsx"],
  //   component: React.lazy(() => import("@/registry/components/audio-player")),
  //   category: "audio",
  //   subcategory: "player",
  //   chunks: []
  // },

  // // 🎤 AUDIO RECORDER
  // "audio-recorder": {
  //   name: "audio-recorder",
  //   description: "Voice message recorder",
  //   type: "registry:component",
  //   files: ["src/registry/components/audio-recorder.tsx"],
  //   component: React.lazy(() => import("@/registry/components/audio-recorder")),
  //   category: "audio",
  //   subcategory: "recorder",
  //   chunks: []
  // },

  // // 🌊 WAVEFORM
  // "audio-waveform": {
  //   name: "audio-waveform",
  //   description: "Waveform visualizer",
  //   type: "registry:component",
  //   files: ["src/registry/components/audio-waveform.tsx"],
  //   component: React.lazy(() => import("@/registry/components/audio-waveform")),
  //   category: "audio",
  //   subcategory: "visualizer",
  //   chunks: []
  // },

}
