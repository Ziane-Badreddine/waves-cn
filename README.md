# waves-cn

A collection of wave players and waveform components built with [wavesurfer.js](https://wavesurfer.xyz) and [shadcn/ui](https://ui.shadcn.com).

## Overview

waves-cn is a custom shadcn/ui-style component package for audio and video waveform interfaces. It provides:

- Waveform audio players with play/pause, volume, progress, speed control, zoom, and timeline
- A wave recorder component for capturing audio directly in the browser
- Video waveform support for synced audio visualization
- Ready-to-use components crafted with [shadcn/ui](https://ui.shadcn.com)
- Easy integration into your React/Next.js project

## Philosophy

waves-cn follows the same philosophy as [shadcn/ui](https://ui.shadcn.com) — components are **not** installed as a package. Instead, you copy the source directly into your project and own it completely. That means:

- No black-box updates
- No version conflicts
- Full freedom to adapt every component to your design system

If you already use shadcn/ui, waves-cn slots right in: it shares the same `cn` utility, Tailwind tokens, and `Button` primitive so everything feels native from day one.

Under the hood, audio rendering is powered by [wavesurfer.js](https://wavesurfer.xyz) — a battle-tested waveform library with a rich plugin ecosystem.

## Components

| Component | Description |
|-----------|-------------|
| **Wave Player** | Full-featured audio player with play/pause, volume, and progress |
| **Wave Recorder** | Capture audio directly in the browser |
| **Wave Speed** | Playback speed control for audio waveforms |
| **Wave Timeline** | Timeline display synced with audio playback |
| **Wave Video** | Video component with synced waveform visualization |
| **Wave Zoom** | Zoom in/out on waveform detail |


### Prerequisites

- React 18+ or Next.js 13+
- Tailwind CSS
- shadcn/ui already configured in your project

### To know more about installation and how to use components
visit : [@waves/cn](https://waves-cn.vercel.app/)


## Contributors


- **Ziane Badreddine** — [GitHub](https://github.com/Ziane-Badreddine)
- **Mouad Sadik** — [GitHub](https://github.com/MouadSadik)

