import {
  SiLucide,
  SiRadixui,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons";

import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger,  } from "../ui/tooltip";
import { Button } from "../ui/button";

const icons = [
  {
    icon: SiReact,
    name: "React",
    color: "#087ea4",
  },
  {
    icon: SiTypescript,
    name: "TypeScript",
    color: "#3178c6",
  },
  {
    icon: SiTailwindcss,
    name: "Tailwind CSS",
    color: "#00bcff",
  },
  {
    icon: SiLucide,
    name: "Lucide",
    color: "#f67373",
  },
];

export const Hero = () => (
  <section
    className="md:h-screen relative  isolate overflow-hidden rounded-4xl bg-background pt-20 sm:pt-12 md:pt-32 lg:pt-32"
    style={{
      backgroundColor: "var(--background)",
    }}
  >
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 select-none border-background/15 border-t">
      <div className="grid grid-cols-24 divide-x divide-y divide-background/15">
        {new Array(24 * 12).fill(0).map((_, index) => (
          <div className="aspect-square w-full" key={index} />
        ))}
      </div>
    </div>
    <div className="container relative z-10 grid gap-8 sm:gap-12 md:gap-16">
      <div className="mx-auto flex flex-col justify-center gap-6 text-balance">
        <h1 className="mb-0 text-balance text-center font-semibold text-4xl tracking-[-0.06em]! sm:text-5xl md:text-6xl xl:text-7xl">
          High quality{" "}
          <div className="ml-2 inline-flex items-center justify-center gap-2 align-bottom">
            <Image
              alt="shadcn/ui"
              className="size-8 overflow-hidden rounded-full sm:size-10 md:size-12 lg:size-14"
              height={56}
              src="/shadcn.jpg"
              width={56}
            />{" "}
            <span>shadcn/ui</span>
          </div>{" "}
          components built with WaveSurfer.js and{" "}
          <div className="-space-x-2 -translate-y-1.5 md:-translate-y-2.5 inline-flex items-center justify-center">
            {icons.map((icon, index) => (
              <Tooltip key={icon.name}>
                <TooltipTrigger asChild>
                  <div
                    className="inline-flex size-8 items-center justify-center rounded-full text-white sm:size-10 md:size-12 lg:size-14"
                    style={{
                      backgroundColor: icon.color,
                      maskImage: index
                        ? "radial-gradient(circle 28px at -17px 50%, transparent 99%, white 100%)"
                        : "none",
                    }}
                  >
                    <icon.icon className="size-3 sm:size-4 md:size-5 lg:size-6" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{icon.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </h1>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-0 mb-0 text-muted-foreground lg:text-lg xl:text-xl 2xl:text-2xl">
            WavesCn is a custom registry of composable, accessible and
            extensible components designed for use with shadcn/ui. Free and open
            source, forever.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/docs/components">Browse components</Link>
          </Button>
          <Button variant="secondary" asChild size="lg">
            <Link href="/docs">Get started</Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);