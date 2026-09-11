import {
  Blocks,
  ClipboardCopy,
  MoonStar,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: ClipboardCopy,
    title: "Copy, paste, own",
    description:
      "Components land in your repo through the shadcn CLI. No package to upgrade, no black box. Edit anything.",
  },
  {
    icon: MoonStar,
    title: "Themed by your tokens",
    description:
      "Wave, progress and cursor colors resolve from your CSS variables, so dark mode and brand themes work out of the box.",
  },
  {
    icon: Blocks,
    title: "Plugins, already wired",
    description:
      "Regions, timeline, minimap, spectrogram, zoom, hover and envelope are pre-integrated with sensible defaults.",
  },
  {
    icon: ShieldCheck,
    title: "Typed end to end",
    description:
      "Every prop and event handler is fully typed against wavesurfer.js, so your editor tells you what is possible.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Why waves-cn
        </p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          Everything a waveform needs, nothing you have to fight
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative flex flex-col gap-4 bg-background p-6 transition-colors hover:bg-muted/50"
          >
            <span className="inline-flex size-10 items-center justify-center rounded-lg border bg-card text-foreground shadow-xs transition-transform group-hover:-translate-y-0.5">
              <f.icon className="size-5" />
            </span>
            <div className="space-y-1.5">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
