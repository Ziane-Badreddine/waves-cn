<div align="center">
  <br>
  <br>
  <picture>
    <img src="/public/logo.svg" alt="waves-cn logo" width="200">
  </picture>
  <br>
  <br>
  <h1>waves-cn</h1>
  <strong>Waveform components for shadcn/ui, built on wavesurfer.js.</strong>
  <br />
  <sub>Drop-in audio and video waveform primitives. Copy, own, customize.</sub>
  <br>
  <br>
  <a href="https://github.com/Ziane-Badreddine/waves-cn/stargazers">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Ziane-Badreddine/waves-cn" />
  </a>
  <a href="https://github.com/Ziane-Badreddine/waves-cn/releases">
    <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-black" />
  </a>
  <a href="https://github.com/Ziane-Badreddine/waves-cn/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-blue" />
  </a>
  <a href="https://waves-cn.vercel.app/">
    <img alt="Docs" src="https://img.shields.io/badge/docs-waves--cn.vercel.app-black" />
  </a>
  <br>
  <br>
  <a href="https://waves-cn.vercel.app/">📖 Documentation</a> ·
  <a href="https://waves-cn.vercel.app/docs/installation">⚡ Quick Start</a> ·
  <a href="https://waves-cn.vercel.app/docs/components/wave-player">🎵 Components</a>
</div>

<br />

## Overview

waves-cn is a shadcn/ui-style collection of waveform components for audio and video interfaces. Components are **not** installed as a package. You copy the source into your project through the shadcn CLI and own it completely.

Under the hood, rendering is powered by [wavesurfer.js](https://wavesurfer.xyz), a battle-tested waveform library with a rich plugin ecosystem. Every waves-cn component wraps one or more of those plugins with shadcn primitives, Tailwind tokens and full TypeScript types.

## What's new in v2

- **Five new components**: Wave Regions, Wave Minimap, Wave Spectrogram, Wave Hover and Wave Envelope. That brings the library to 11 components.
- **Plugin lifecycle fix**: the shared `wave-cn` core now re-creates plugin instances whenever wavesurfer remounts, so plugin-based components survive prop changes and hot reloads.
- **Registry namespace**: install everything through the `@waves-cn` registry, e.g. `npx shadcn@latest add @waves-cn/wave-regions`.
- **New homepage**: live demos of every component, install steps and a redesigned hero.
- **Docs reorganised** under `/docs/components/*` with a live preview, CLI and manual install tabs, and multiple examples per component.

## Components

| Component            | Description                                                                 | wavesurfer plugin |
| -------------------- | --------------------------------------------------------------------------- | ----------------- |
| **Wave Player**      | Full audio player with play/pause, volume, seek bar and optional title       | –                 |
| **Wave Recorder**    | Record audio in the browser with a live waveform, pause/resume and discard   | Record            |
| **Wave Regions**     | Draggable, resizable region markers for selecting audio segments             | Regions           |
| **Wave Timeline**    | Timeline ruler synced with playback, plus zoom and volume controls           | Timeline          |
| **Wave Minimap**     | Compact overview waveform that tracks the main player                        | Minimap           |
| **Wave Spectrogram** | Frequency heatmap rendered beneath the waveform                              | Spectrogram       |
| **Wave Speed**       | Continuous playback speed control with preserve-pitch toggle                 | –                 |
| **Wave Zoom**        | Mouse-wheel zoom into waveform detail                                        | Zoom              |
| **Wave Hover**       | Hover cursor with a time tooltip that follows the pointer                    | Hover             |
| **Wave Envelope**    | Editable volume automation points over the waveform                          | Envelope          |
| **Wave Video**       | Waveform synced to a video element                                           | –                 |

All components depend on a shared core, `wave-cn`, which ships the `WavesurferPlayer` component, the `useWavePlayer` and `useWavesurfer` hooks, `formatTime`, `useCssVar` and the default option set. The CLI installs it automatically, together with the shadcn primitives each component uses.

## Quick Start

### 1. Prerequisites

- React 18 or newer (React 19 supported)
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com/docs/installation) initialised in your project

### 2. Register the registry

Declare the `@waves-cn` namespace once per project, with the CLI:

```bash
npx shadcn@latest registry add @waves-cn=https://waves-cn.vercel.app/r/{name}.json
```

or by editing `components.json`:

```json
{
  "registries": {
    "@waves-cn": "https://waves-cn.vercel.app/r/{name}.json"
  }
}
```

### 3. Add a component

```bash
npx shadcn@latest add @waves-cn/wave-player
```

pnpm, yarn and bun work the same way (`pnpm dlx`, `yarn dlx`, `bunx --bun`). Component files land in `components/waves-cn/` and the shared core in `lib/wave-cn.tsx`.

### 4. Use it

```tsx
import WavePlayer from "@/components/waves-cn/wave-player";

export default function Page() {
  return <WavePlayer src="/track.mp3" title="My track" />;
}
```

Full guide, including manual installation: [waves-cn.vercel.app/docs/installation](https://waves-cn.vercel.app/docs/installation)

## Using the core directly

If you need something the prebuilt components do not cover, the core is yours too:

```tsx
import WavesurferPlayer, { useWavePlayer, useWavesurfer } from "@/lib/wave-cn";

// Declarative player with shared state + controls
const player = useWavePlayer({ defaultVolume: 0.8 });
<WavesurferPlayer url="/track.mp3" height={80} {...player.handlers} />;
<button onClick={player.togglePlay}>{player.isPlaying ? "Pause" : "Play"}</button>;

// Imperative, you own the container
const containerRef = useRef<HTMLDivElement>(null);
const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
  container: containerRef,
  url: "/track.mp3",
});
```

Only `url`, `media`, `plugins`, `peaks`, `duration`, `sampleRate` and `backend` recreate the instance. Every other option is applied in place, so cosmetic changes never re-decode the audio. Pass `peaks` + `duration` to render instantly from precomputed data.

Wave, progress and cursor colors resolve from your CSS variables, so dark mode and brand themes apply without extra work.

## Philosophy

waves-cn follows the same philosophy as [shadcn/ui](https://ui.shadcn.com): no black-box updates, no version conflicts, full freedom to adapt every component to your design system. If you already use shadcn/ui, waves-cn slots right in. It shares the same `cn` utility, Tailwind tokens and component primitives, so everything feels native from day one.

## Development

```bash
npm install
npm run dev              # docs site + live demos at http://localhost:3000
npm run registry:build   # regenerate public/r/*.json from registry.json
npm run types:check      # fumadocs-mdx + next typegen + tsc
```

Registry JSON is rebuilt automatically by CI when anything under `src/registry/**` changes on a push. Pull requests fail if `public/r` is out of date.

## Contributing

Issues and pull requests are welcome. Good places to start:

- A new component wrapping a wavesurfer plugin
- Extra examples on an existing docs page
- Bug fixes in `src/registry/lib/wave-cn.tsx`

Open an issue first for larger changes so we can agree on the API.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for repo layout, the add-a-component walkthrough and the PR checklist.

## Contributors

- **Badreddine Ziane** — [GitHub](https://github.com/Ziane-Badreddine)
- **Mouad Sadik** — [GitHub](https://github.com/MouadSadik)

## License

[MIT](./LICENSE)
