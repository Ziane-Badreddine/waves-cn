import { defineConfig, distributed, type RegistryItem } from "jsrepo";
import { output } from "@jsrepo/shadcn";
type ComponentName =
  | "wave-cn"
  | "wave-player"
  | "wave-recorder"
  | "wave-speed"
  | "wave-zoom"
  | "wave-video"
  | "wave-timeline";

type ComponentEntry = {
  name: ComponentName;
  title: string;
  description: string;
  extraDeps?: string[];
};

const components: ComponentEntry[] = [
  {
    name: "wave-cn",
    title: "wave-cn",
    description:
      "Core hook, player and shared defaults powering all waves-cn components. Built on wavesurfer.js.",
  },
  {
    name: "wave-player",
    title: "Wave Player",
    description:
      "Full-featured audio player with play/pause, volume, seek bar and optional title.",
    extraDeps: ["lucide-react"],
  },
  {
    name: "wave-recorder",
    title: "Wave Recorder",
    description:
      "Voice message recorder with live waveform, pause/resume, discard and auto-stop.",
    extraDeps: ["lucide-react"],
  },
  {
    name: "wave-speed",
    title: "Wave Speed",
    description:
      "Audio player with continuous playback speed control and preserve-pitch toggle.",
    extraDeps: ["lucide-react"],
  },
  {
    name: "wave-zoom",
    title: "Wave Zoom",
    description:
      "Audio player with mouse-wheel zoom via wavesurfer.js ZoomPlugin.",
    extraDeps: ["lucide-react"],
  },
  {
    name: "wave-video",
    title: "Wave Video",
    description:
      "Waveform player synced to a video element via the wavesurfer.js media prop.",
    extraDeps: ["lucide-react"],
  },
  {
    name: "wave-timeline",
    title: "Wave Timeline",
    description:
      "Audio player with timeline ruler, zoom slider and volume control. Powered by wavesurfer.js TimelinePlugin.",
    extraDeps: ["lucide-react"],
  },
];

function defineComponent(entry: ComponentEntry): RegistryItem {
  const isLib = entry.name === "wave-cn";

  return {
    name: entry.name,
    title: entry.title,
    description: entry.description,
    type: isLib ? "lib" : "component",
    categories: ["wave"],
    dependencies: ["wavesurfer.js", ...(entry.extraDeps ?? [])],
    // Only reference items that exist IN THIS registry
    // shadcn deps (button, slider, etc.) are peer deps — documented but not resolvable here
    registryDependencies: isLib ? [] : ["wave-cn"],
    // wave-cn is a silent dep — installed automatically when any component is added
    add: isLib ? "when-needed" : "when-added",
    files: [
      {
        path: isLib
          ? `src/lib/${entry.name}.tsx`
          : `src/registry/components/${entry.name}.tsx`,
        // Prevent jsrepo from chasing @/lib/utils and @/components/ui/* imports —
        // those are shadcn/ui peer deps that live in the user's project, not this registry
        dependencyResolution: "manual",
      },
    ],
  };
}

export default defineConfig({
  registry: {
    name: "@waves-cn/ui",
    description: "Waveform components for shadcn/ui — built on wavesurfer.js.",
    homepage: "https://waves-cn.vercel.app",
    authors: ["Badreddine Ziane", "Mouad Sadik"],
    bugs: "https://github.com/Ziane-Badreddinewaves-cn/issues",
    repository: "https://github.com/Ziane-Badreddine/waves-cn",
    version: "1.0.4",
    tags: [
      "wavesurfer",
      "audio",
      "waveform",
      "shadcn",
      "react",
      "nextjs",
      "tailwind",
      "recorder",
      "player",
      "video",
    ],
    excludeDeps: ["react", "react-dom", "next"],
    outputs: [output({ dir: "public/r", format: true })],
    items: components.map(defineComponent),
  },
});
