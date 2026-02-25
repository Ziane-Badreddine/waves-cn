# File Tree: waves-cn

**Generated:** 2/25/2026, 11:21:24 PM
**Root Path:** `d:\public\projects\waves-cn`

```
├── 📁 content
│   └── 📁 docs
│       ├── 📁 components
│       │   ├── 📄 wave-player.mdx
│       │   ├── 📄 wave-recorder.mdx
│       │   ├── 📄 wave-speed.mdx
│       │   ├── 📄 wave-timeline.mdx
│       │   ├── 📄 wave-video.mdx
│       │   └── 📄 wave-zoom.mdx
│       ├── 📄 component-library.mdx
│       ├── 📄 index.mdx
│       ├── ⚙️ meta.json
│       ├── 📄 plugins.mdx
│       ├── 📄 use-wavesurfer.mdx
│       ├── 📄 wave-cn.mdx
│       ├── 📄 wave-defaults.mdx
│       └── 📄 wavesurfer-player.mdx
├── 📁 public
│   ├── 🎵 coastline.mp3
│   ├── 🎬 coastline.mp4
│   ├── 🖼️ logo.svg
│   └── 🖼️ shadcn.jpg
├── 📁 src
│   ├── 📁 __registry__
│   │   └── 📄 index.tsx
│   ├── 📁 app
│   │   ├── 📁 (home)
│   │   │   ├── 📄 layout.tsx
│   │   │   └── 📄 page.tsx
│   │   ├── 📁 api
│   │   │   └── 📁 search
│   │   │       └── 📄 route.ts
│   │   ├── 📁 docs
│   │   │   ├── 📁 [[...slug]]
│   │   │   │   └── 📄 page.tsx
│   │   │   └── 📄 layout.tsx
│   │   ├── 📁 llms-full.txt
│   │   │   └── 📄 route.ts
│   │   ├── 📁 llms.mdx
│   │   │   └── 📁 docs
│   │   │       └── 📁 [[...slug]]
│   │   │           └── 📄 route.ts
│   │   ├── 📁 llms.txt
│   │   │   └── 📄 route.ts
│   │   ├── 📁 og
│   │   │   └── 📁 docs
│   │   │       └── 📁 [...slug]
│   │   │           └── 📄 route.tsx
│   │   ├── 📁 test
│   │   │   └── 📁 audio-recorder
│   │   │       └── 📄 page.tsx
│   │   ├── 🖼️ android-chrome-192x192.png
│   │   ├── 🖼️ android-chrome-512x512.png
│   │   ├── 🖼️ apple-touch-icon.png
│   │   ├── 🖼️ favicon-16x16.png
│   │   ├── 🖼️ favicon-32x32.png
│   │   ├── 📄 favicon.ico
│   │   ├── 🎨 global.css
│   │   ├── 📄 layout.tsx
│   │   └── 📄 site.webmanifest
│   ├── 📁 components
│   │   ├── 📁 ai
│   │   │   └── 📄 page-actions.tsx
│   │   ├── 📁 cors
│   │   │   └── 📄 wavesurfer-player.tsx
│   │   ├── 📁 home
│   │   │   ├── 📄 components-example.tsx
│   │   │   ├── 📄 contributors.tsx
│   │   │   ├── 📄 footer.tsx
│   │   │   ├── 📄 hero.tsx
│   │   │   ├── 📄 wave-hero.tsx
│   │   │   └── 📄 works-with.tsx
│   │   ├── 📁 layout
│   │   │   ├── 📁 home
│   │   │   │   ├── 📄 client.tsx
│   │   │   │   └── 📄 index.tsx
│   │   │   ├── 📁 navbar
│   │   │   │   └── 📄 logo.tsx
│   │   │   ├── 📁 sidebar
│   │   │   │   ├── 📁 tabs
│   │   │   │   │   ├── 📄 dropdown.tsx
│   │   │   │   │   └── 📄 index.tsx
│   │   │   │   ├── 📄 base.tsx
│   │   │   │   ├── 📄 link-item.tsx
│   │   │   │   └── 📄 page-tree.tsx
│   │   │   ├── 📄 language-toggle.tsx
│   │   │   ├── 📄 link-item.tsx
│   │   │   ├── 📄 search-toggle.tsx
│   │   │   ├── 📄 shared.tsx
│   │   │   └── 📄 theme-toggle.tsx
│   │   ├── 📁 ui
│   │   │   ├── 📄 accordion.tsx
│   │   │   ├── 📄 avatar.tsx
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 collapsible.tsx
│   │   │   ├── 📄 label.tsx
│   │   │   ├── 📄 navigation-menu.tsx
│   │   │   ├── 📄 popover.tsx
│   │   │   ├── 📄 resizable.tsx
│   │   │   ├── 📄 scroll-area.tsx
│   │   │   ├── 📄 select.tsx
│   │   │   ├── 📄 skeleton.tsx
│   │   │   ├── 📄 slider.tsx
│   │   │   ├── 📄 sonner.tsx
│   │   │   ├── 📄 switch.tsx
│   │   │   ├── 📄 tabs.tsx
│   │   │   └── 📄 tooltip.tsx
│   │   ├── 📄 card.tsx
│   │   ├── 📄 codeblock.tsx
│   │   ├── 📄 component-preview-wrapper.tsx
│   │   ├── 📄 component-preview.tsx
│   │   ├── 📄 icons.tsx
│   │   ├── 📄 steps.tsx
│   │   └── 📄 tabs.tsx
│   ├── 📁 hooks
│   │   └── 📄 use-css-var.ts
│   ├── 📁 lib
│   │   ├── 📄 cn.ts
│   │   ├── 📄 layout.shared.tsx
│   │   ├── 📄 merge-refs.ts
│   │   ├── 📄 source.ts
│   │   ├── 📄 urls.ts
│   │   └── 📄 utils.ts
│   ├── 📁 registry
│   │   ├── 📁 components
│   │   │   ├── 📄 wave-player.tsx
│   │   │   ├── 📄 wave-recorder.tsx
│   │   │   ├── 📄 wave-speed.tsx
│   │   │   ├── 📄 wave-timeline.tsx
│   │   │   ├── 📄 wave-video.tsx
│   │   │   └── 📄 wave-zoom.tsx
│   │   ├── 📁 examples
│   │   │   ├── 📁 wave-player
│   │   │   │   ├── 📄 wave-player-custom-example.tsx
│   │   │   │   ├── 📄 wave-player-example.tsx
│   │   │   │   ├── 📄 wave-player-minimal-example.tsx
│   │   │   │   └── 📄 wave-player-with-title-example.tsx
│   │   │   ├── 📁 wave-recorder
│   │   │   │   ├── 📄 wave-recorder-custom-wave.tsx
│   │   │   │   ├── 📄 wave-recorder-demo.tsx
│   │   │   │   ├── 📄 wave-recorder-minimal.tsx
│   │   │   │   └── 📄 wave-recorder-timed.tsx
│   │   │   ├── 📁 wave-speed
│   │   │   │   ├── 📄 wave-speed-custom-wave.tsx
│   │   │   │   ├── 📄 wave-speed-demo.tsx
│   │   │   │   └── 📄 wave-speed-podcast.tsx
│   │   │   ├── 📁 wave-timeline
│   │   │   │   ├── 📄 wave-timeline-dual-example.tsx
│   │   │   │   ├── 📄 wave-timeline-example.tsx
│   │   │   │   └── 📄 wave-timeline-no-ruler-example.tsx
│   │   │   ├── 📁 wave-video
│   │   │   │   ├── 📄 wave-video-custom-wave.tsx
│   │   │   │   └── 📄 wave-video-demo.tsx
│   │   │   ├── 📁 wave-zoom
│   │   │   │   ├── 📄 wave-zoom-custom-range.tsx
│   │   │   │   ├── 📄 wave-zoom-custom-wave.tsx
│   │   │   │   └── 📄 wave-zoom-demo.tsx
│   │   │   └── 📄 test.tsx
│   │   └── 📁 lib
│   │       └── 📄 wave-cn.tsx
│   └── 📄 mdx-components.tsx
├── ⚙️ .gitignore
├── 📝 README.md
├── ⚙️ cli.json
├── ⚙️ components.json
├── 📄 eslint.config.mjs
├── 📄 next.config.mjs
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 postcss.config.mjs
├── 📄 source.config.ts
└── ⚙️ tsconfig.json
```

---

_Generated by FileTree Pro Extension_
