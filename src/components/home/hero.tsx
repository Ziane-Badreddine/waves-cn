"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Github, Library } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import {
  SiLucide,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiShadcnui,
} from "@icons-pack/react-simple-icons";
import { ComponentPreviewWrapper } from "../component-preview-wrapper";
import { SiGithub } from "react-icons/si";
import { GiWaveSurfer } from "react-icons/gi";
import WavesurferPlayer from "../cors/wavesurfer-player";
import WaveHero from "./wave-hero";

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
  {
    icon: SiShadcnui,
    name: "Shadcn UI",
    color: "#000000",
  },
  {
    icon: GiWaveSurfer,
    name: "WaveSurfer",
    color: "#7F00FF",
  },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden rounded-4xl bg-background py-8 sm:py-12 md:py-16 lg:py-24">
      <aside className="my-16 relative text-center justify-center flex flex-col items-center self-center  xl:flex-1 ">
        <WaveHero />
        <p className="my-8 text-center text-2xl md:text-3xl ">
          <span className="font-semibold">@waves/cn</span> a collection of
          waveform components
          <br />
          built with <span className="font-semibold">
            wavesurfer.js
          </span> and <span className="font-semibold">shadcn/ui.</span>
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link
            href="/docs"
            className={cn(
              buttonVariants({
                size: "lg",
              }),
              "text-md w-full rounded-full sm:w-auto",
            )}
          >
            <Library className=" inline-block" size={20} />
            Documentation
          </Link>
          <a
            href="https://github.com/Ziane-Badreddine/waves-cn"
            className={cn(
              buttonVariants({
                size: "lg",
                variant: "secondary",
              }),
              "text-md w-full rounded-full sm:w-auto",
            )}
          >
            <SiGithub className=" -ml-1 inline-block" size={20} />
            GitHub
          </a>
        </nav>
        <div className="-space-x-2 -translate-y-1.5 md:-translate-y-2.5 inline-flex items-center justify-center mt-10">
          {icons.map((icon, index) => (
            <Tooltip key={icon.name}>
              <TooltipTrigger asChild>
                <div
                  className="inline-flex size-14 items-center justify-center rounded-full text-white border border-primary "
                  style={{
                    backgroundColor: icon.color,
                    maskImage: index
                      ? "radial-gradient(circle 28px at -17px 50%, transparent 99%, white 100%)"
                      : "none",
                  }}
                >
                  <icon.icon className="size-6 lg:size-7" />
                </div>
              </TooltipTrigger>
              <TooltipContent>{icon.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </aside>
      {/* <aside className="relative xl:my-auto xl:flex-1 xl:pt-4">
        <div className="absolute -z-1 inset-0 bg-[radial-gradient(ellipse_at_90%_30%,var(--primary),transparent_25%)] blur-3xl" />

        <div className="absolute -z-1 inset-0 bg-[radial-gradient(ellipse_at_10%_70%,var(--primary),transparent_10%)] blur-3xl" />

        <ComponentPreviewWrapper name="wave-video-demo" variant="preview" />
      </aside> */}

      <div
        className="animate-bounce right-0 -bottom-12 left-0 hidden h-12 items-center justify-center xl:flex"
        aria-hidden
      >
        <ChevronDown />
      </div>

      <div className="absolute -z-1 inset-0 bg-[radial-gradient(ellipse_at_10%_70%,var(--primary),transparent_10%)] blur-3xl" />
    </section>
  );
}
