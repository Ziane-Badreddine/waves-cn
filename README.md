<div align="center">
	<br>
	<br>
    <picture>
      <img src="/public/logo.svg" alt=" logo" width="200">
    </picture>
	<br>
	<br>
  <strong>Waveform components for shadcn/ui — built on wavesurfer.js.</strong>
  <br />
  <sub>Drop-in audio & video waveform primitives. Copy, own, customize.</sub>
	<br>
	<br>
  <a href="https://github.com/Ziane-Badreddine//stargazers"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/Ziane-Badreddine/"></a>
  <a href="https://github.com/Ziane-Badreddine//blob/main/LICENSE.md"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue"></a>
  <a href="https://.vercel.app/"><img alt="docs" src="https://img.shields.io/badge/docs-waves--cn.vercel.app-black"></a>
  <br>
  <br>
  <a href="https://.vercel.app/">📖 Documentation</a> · <a href="https://.vercel.app/docs/installation">⚡ Quick Start</a> · <a href="https://.vercel.app/docs/components/wave-player">🎵 Components</a>
</div>

<br />

## Overview

 is a shadcn/ui-style collection of waveform components for audio and video interfaces. Components are **not** installed as a package — you copy the source directly into your project and own it completely.

| Component         | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Wave Player**   | Full-featured audio player with play/pause, volume, seek bar and optional title    |
| **Wave Recorder** | Capture audio directly in the browser with live waveform visualization             |
| **Wave Speed**    | Playback speed control with pitch preservation toggle                              |
| **Wave Timeline** | Timeline ruler synced with audio playback, powered by wavesurfer.js TimelinePlugin |
| **Wave Video**    | Video player with synced waveform visualization                                    |
| **Wave Zoom**     | Mouse-wheel zoom on waveform detail via ZoomPlugin                                 |

## Philosophy

 follows the same philosophy as [shadcn/ui](https://ui.shadcn.com) — no black-box updates, no version conflicts, full freedom to adapt every component to your design system. If you already use shadcn/ui,  slots right in: it shares the same `cn` utility, Tailwind tokens, and component primitives so everything feels native.

Audio rendering is powered by [wavesurfer.js](https://wavesurfer.xyz) — a battle-tested waveform library with a rich plugin ecosystem.

## Quick Start

```bash
npx shadcn@latest add @waves-cn/{name}
```

### Prerequisites

- React 18+
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com/docs/installation) initialized in your project

→ Full installation guide at [[https://waves-cn.vercel.app/docs/installation)](https://waves-cn.vercel.app/docs/installation)

## Contributors

- **Ziane Badreddine** — [GitHub](https://github.com/Ziane-Badreddine)
- **Mouad Sadik** — [GitHub](https://github.com/MouadSadik)
