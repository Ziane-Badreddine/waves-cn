import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, icons, type LucideProps } from "lucide-react";
import Link from "next/link";
import { type ComponentType, createElement } from "react";
import { source } from "@/lib/source";

import WavePlayer from "@/registry/components/wave-player";
import WaveRecorder from "@/registry/components/wave-recorder";
import WaveSpeed from "@/registry/components/wave-speed";
import WaveTimeline from "@/registry/components/wave-timeline";
import WaveVideo from "@/registry/components/wave-video";
import WaveZoom from "@/registry/components/wave-zoom";
import Grid from "@/components/grid";

// ─── Source pages ─────────────────────────────────────────────────────────────
const wavePlayer = source.getPage(["components", "wave-player"]);
const waveRecorder = source.getPage(["components", "wave-recorder"]);
const waveSpeed = source.getPage(["components", "wave-speed"]);
const waveTimeline = source.getPage(["components", "wave-timeline"]);
const waveVideo = source.getPage(["components", "wave-video"]);
const waveZoom = source.getPage(["components", "wave-zoom"]);

// ─── Demo audio / video ───────────────────────────────────────────────────────
const DEMO_AUDIO = "/coastline.mp3";
const DEMO_VIDEO = "/coastline.mp4";

// ─── Examples ─────────────────────────────────────────────────────────────────
const examples = [
  {
    icon: wavePlayer?.data.icon,
    name: wavePlayer?.data.title,
    description: wavePlayer?.data.description,
    component: () => (
      <WavePlayer
        src={DEMO_AUDIO}
        title="Demo Track"
        className="px-6 pb-6 my-auto shadow-none"
      />
    ),
  },
  {
    icon: waveRecorder?.data.icon,
    name: waveRecorder?.data.title,
    description: waveRecorder?.data.description,
    component: () => <WaveRecorder className="px-6 pb-6 my-auto" />,
  },
  {
    icon: waveSpeed?.data.icon,
    name: waveSpeed?.data.title,
    description: waveSpeed?.data.description,
    component: () => (
      <WaveSpeed url={DEMO_AUDIO} className="px-6 pb-6 my-auto" />
    ),
  },
  {
    icon: waveTimeline?.data.icon,
    name: waveTimeline?.data.title,
    description: waveTimeline?.data.description,
    component: () => (
      <WaveTimeline
        src={DEMO_AUDIO}
        title="Demo Track"
        className="px-6 pb-6 my-auto shadow-none"
      />
    ),
  },
  {
    icon: waveVideo?.data.icon,
    name: waveVideo?.data.title,
    description: waveVideo?.data.description,
    component: () => (
      <WaveVideo url={DEMO_VIDEO} className="px-6 pb-6 my-auto" />
    ),
  },
  {
    icon: waveZoom?.data.icon,
    name: waveZoom?.data.title,
    description: waveZoom?.data.description,
    component: () => (
      <WaveZoom url={DEMO_AUDIO} className="px-6 pb-6 my-auto" />
    ),
  },
];

// ─── ExampleCard ──────────────────────────────────────────────────────────────
const ExampleCard = ({
  icon,
  name,
  description,
  component: Component,
  className,
  index
}: {
  icon: string | undefined;
  name: string | undefined;
  description: string | undefined;
  component: ComponentType;
  className?: string;
  index: number
}) => {
  const Icon =
    icon && icon in icons
      ? (props: LucideProps) =>
          createElement(icons[icon as keyof typeof icons], { ...props })
      : null;

  return (
    <div
      className={cn(
        className="relative bg-linear-to-b  dark:from-neutral-900 from-secondary dark:to-neutral-950 to-white  py-2 overflow-hidden flex flex-col items-center border gap-4 ",
        className,
      )}
    >
      <Grid size={index * 5 + 10} />
      <div className="grid gap-2 px-6 pt-6">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-muted-foreground" size={16} />}
          {name && <p className="font-medium">{name}</p>}
        </div>
        {description && (
          <p className="text-balance text-muted-foreground">{description}</p>
        )}
      </div>
      <Component />
    </div>
  );
};

// ─── Components ───────────────────────────────────────────────────────────────
export const ComponentsExample = () => (
  <div className="px-4 md:px-6 mx-2 md:mx-auto grid gap-8 md:mt-0 mt-20">
    <div className="flex w-full flex-col items-start justify-between gap-4 md:flex-row">
      <div className="grid gap-4">
        <h2 className="max-w-lg font-semibold text-3xl text-start">
          Waveform components for every use case
        </h2>
        <p className="max-w-xl text-balance text-lg text-muted-foreground text-start">
          waves-cn components are built on wavesurfer.js and shadcn/ui — copy
          them into your project and own them completely.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/docs">
          <span>Explore components</span>
          <ArrowRightIcon size={16} />
        </Link>
      </Button>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {examples.map((example,i) => (
        <ExampleCard index={i} key={example.name} {...example} />
      ))}
    </div>
  </div>
);
