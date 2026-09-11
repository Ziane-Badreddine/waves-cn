import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  ArrowUpRight,
  AudioLines,
  AudioWaveform,
  Blend,
  Film,
  Gauge,
  Map,
  Mic,
  MousePointer2,
  Ruler,
  Scissors,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { type ComponentType } from "react";
import { source } from "@/lib/source";

import WavePlayer from "@/registry/components/wave-player";
import WaveRecorder from "@/registry/components/wave-recorder";
import WaveSpeed from "@/registry/components/wave-speed";
import WaveTimeline from "@/registry/components/wave-timeline";
import WaveVideo from "@/registry/components/wave-video";
import WaveZoom from "@/registry/components/wave-zoom";
import WaveRegions from "@/registry/components/wave-regions";
import WaveMinimap from "@/registry/components/wave-minimap";
import WaveSpectrogram from "@/registry/components/wave-spectrogram";
import WaveHover from "@/registry/components/wave-hover";
import WaveEnvelope from "@/registry/components/wave-envelope";

// ─── Demo audio / video ───────────────────────────────────────────────────────
const DEMO_AUDIO = "/coastline.mp3";
const DEMO_VIDEO = "/coastline.mp4";
const DEMO_CLASS = "my-auto w-full px-6 pb-6 shadow-none";

// ─── Examples ─────────────────────────────────────────────────────────────────
type Example = {
  slug: string;
  icon: LucideIcon;
  component: ComponentType;
  span?: string;
};

const examples: Example[] = [
  {
    slug: "wave-player",
    icon: AudioLines,
    component: () => (
      <WavePlayer src={DEMO_AUDIO} title="Demo Track" className={DEMO_CLASS} />
    ),
  },
  {
    slug: "wave-recorder",
    icon: Mic,
    component: () => <WaveRecorder className={DEMO_CLASS} />,
  },
  {
    slug: "wave-regions",
    icon: Scissors,
    component: () => (
      <WaveRegions src={DEMO_AUDIO} title="Demo Track" className={DEMO_CLASS} />
    ),
  },
  {
    slug: "wave-timeline",
    icon: Ruler,
    component: () => (
      <WaveTimeline
        src={DEMO_AUDIO}
        title="Demo Track"
        className={DEMO_CLASS}
      />
    ),
  },
  {
    slug: "wave-minimap",
    icon: Map,
    component: () => (
      <WaveMinimap src={DEMO_AUDIO} title="Demo Track" className={DEMO_CLASS} />
    ),
  },
  {
    slug: "wave-spectrogram",
    icon: AudioWaveform,
    component: () => (
      <WaveSpectrogram
        src={DEMO_AUDIO}
        title="Demo Track"
        className={DEMO_CLASS}
      />
    ),
  },
  {
    slug: "wave-speed",
    icon: Gauge,
    component: () => <WaveSpeed url={DEMO_AUDIO} className={DEMO_CLASS} />,
  },
  {
    slug: "wave-zoom",
    icon: ZoomIn,
    component: () => <WaveZoom url={DEMO_AUDIO} className={DEMO_CLASS} />,
  },
  {
    slug: "wave-hover",
    icon: MousePointer2,
    component: () => (
      <WaveHover src={DEMO_AUDIO} title="Demo Track" className={DEMO_CLASS} />
    ),
  },
  {
    slug: "wave-envelope",
    icon: Blend,
    component: () => (
      <WaveEnvelope
        src={DEMO_AUDIO}
        title="Demo Track"
        className={DEMO_CLASS}
      />
    ),
  },
  {
    slug: "wave-video",
    icon: Film,
    component: () => <WaveVideo url={DEMO_VIDEO} className={DEMO_CLASS} />,
  },
];

// ─── ExampleCard ──────────────────────────────────────────────────────────────
function ExampleCard({ slug, icon: Icon, component: Component, span }: Example) {
  const page = source.getPage(["components", slug]);
  const title = page?.data.title ?? slug;
  const description = page?.data.description;
  const href = page?.url ?? `/docs/components/${slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.3)]",
        span,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
      />

      <header className="flex items-start justify-between gap-3 p-6 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background text-foreground shadow-xs">
            <Icon className="size-4" />
          </span>
          <div className="min-w-0 space-y-1">
            <h3 className="font-semibold leading-tight">{title}</h3>
            {description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        <Link
          href={href}
          aria-label={`${title} documentation`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-foreground"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </header>

      <div className="mt-auto flex flex-1 flex-col justify-end">
        <Component />
      </div>
    </article>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────
export const ComponentsExample = () => (
  <section
    id="components"
    className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 md:px-6 md:pb-28"
  >
    <div className="flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Components
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          One for every audio use case
        </h2>
        <p className="text-balance text-base text-muted-foreground md:text-lg">
          {examples.length} components, every one live below. Play, drag,
          zoom, record. Then copy the one you need.
        </p>
      </div>
      <Button asChild size="lg" className="rounded-full">
        <Link href="/docs/components/wave-player">
          Browse the docs
          <ArrowRightIcon size={16} />
        </Link>
      </Button>
    </div>

    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {examples.map((example) => (
        <ExampleCard key={example.slug} {...example} />
      ))}
    </div>
  </section>
);
