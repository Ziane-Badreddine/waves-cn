# Contributing to waves-cn

Thanks for helping out. This guide covers how the repo is laid out, how to run it, and what a good pull request looks like.

## Ground rules

- Be respectful. Assume good intent in reviews and discussions.
- Open an issue before a large change (new component, API change, new dependency) so we can agree on the shape first.
- Small fixes (typos, docs, obvious bugs) can go straight to a pull request.

## Project layout

```
registry.json                 Registry manifest consumed by the shadcn CLI
public/r/*.json               Generated registry output (do not edit by hand)
src/registry/lib/wave-cn.tsx  Shared core: WavesurferPlayer, useWavesurfer, defaults
src/registry/components/      One file per component, this is what users install
src/registry/examples/        Demo files rendered in the docs and homepage
src/__registry__/index.tsx    Maps example names to lazy imports for previews
content/docs/components/      One MDX page per component
content/docs/meta.json        Sidebar order for the docs
src/components/home/          Homepage sections
```

`src/lib/wave-cn.tsx` only re-exports `src/registry/lib/wave-cn.tsx`, so the docs site always runs the exact file users install. Edit the registry copy only.

## Getting started

```bash
git clone https://github.com/Ziane-Badreddine/waves-cn
cd waves-cn
npm install
npm run dev
```

The site runs at http://localhost:3000 with live previews of every component.

Useful scripts:

| Script                   | What it does                                              |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Start the docs site                                       |
| `npm run build`          | Production build, run before opening a PR                 |
| `npm run types:check`    | MDX generation, Next type generation and `tsc --noEmit`   |
| `npm run lint`           | ESLint                                                    |
| `npm run registry:build` | Regenerate `public/r/*.json` from `registry.json`         |

## Adding a component

1. **Write the component** in `src/registry/components/wave-<name>.tsx`.
   - Import the core from `@/lib/wave-cn` (the CLI rewrites this path on install).
   - Export both a named export and a default export.
   - Accept `src`, optional `title`, `className`, `waveHeight`, and the `onPlay/onPause/onFinish/onTimeUpdate` callbacks. Build on `useWavePlayer()` from the core and spread `player.handlers` onto `<WavesurferPlayer>`.
   - Use shadcn primitives from `@/components/ui/*` and Tailwind tokens only. No hard-coded colours.
   - Memoise plugin creation with `useMemo` (plugin option props in the deps) and guard with `typeof document === "undefined"`. Register plugin listeners in a `useEffect` keyed on the live plugin instance, never inside `onReady`.
2. **Add examples** in `src/registry/examples/wave-<name>/`. At minimum a `wave-<name>-demo.tsx`. Add one more showing a non-default option.
3. **Register the examples** in `src/__registry__/index.tsx` so the docs can preview them.
4. **Add the registry entry** in `registry.json`. Copy an existing block and update `name`, `title`, `description` and `files[].path` / `target`.
5. **Write the docs page** at `content/docs/components/wave-<name>.mdx`. Copy an existing page and keep the structure: preview, installation (CLI + manual tabs), usage, examples, props table.
6. **Add it to the sidebar** in `content/docs/meta.json`.
7. **Rebuild the registry** with `npm run registry:build` and commit the generated `public/r/wave-<name>.json`.

Optionally add it to the homepage showcase in `src/components/home/components-example.tsx`.

## Changing the core

Edits to `src/registry/lib/wave-cn.tsx` affect every component. After a change:

- Run `npm run registry:build` so `public/r/wave-cn.json` picks it up.
- Smoke-test at least one plugin component (Regions or Timeline) and one plain one (Player) in the dev site.

## Docs

Docs are MDX rendered by Fumadocs. Component previews use:

```mdx
<ComponentPreviewWrapper name="wave-player-demo" />
<ComponentPreviewWrapper name="wave-player" variant="codesource" />
```

The `name` must match a key in `src/__registry__/index.tsx`.

## Pull request checklist

- [ ] `npm run types:check` passes
- [ ] `npm run build` passes
- [ ] `npm run registry:build` was run if anything under `src/registry/**` or `registry.json` changed, and the output is committed
- [ ] New or changed behaviour has a docs example
- [ ] No new runtime dependencies without discussion in an issue

CI builds the registry on every push and fails pull requests whose `public/r` output is stale.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(regions): add readOnly prop
fix(core): recreate plugin instances on remount
docs(minimap): add custom height example
chore: auto-build registry
```

## Reporting bugs

Open an issue with:

- What you expected and what happened
- A minimal reproduction (a StackBlitz or a repo link is ideal)
- Browser and OS, plus `wavesurfer.js` and `next` versions from your lockfile

## License

By contributing you agree that your contributions are licensed under the [MIT License](./LICENSE).
