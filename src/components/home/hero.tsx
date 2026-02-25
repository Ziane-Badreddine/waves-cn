import { cn } from '@/lib/utils'
import { ChevronDown, Github, Library } from 'lucide-react'
import Link from 'next/link'
import WaveVideo from '@/registry/components/wave-video'
import { buttonVariants } from '../ui/button'
import { WorksWith } from './works-with'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

import {
  SiLucide,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiShadcnui
} from "@icons-pack/react-simple-icons";
import { ComponentPreviewWrapper } from '../component-preview-wrapper'

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
];

export function Hero() {
  return (
    <section className="relative container md:mb-40 grid grid-cols-1 items-center justify-center gap-8 xl:h-[max(650px,min(800px,calc(75vh)))] xl:grid-cols-2 xl:flex-row">
      <aside className="my-16 flex flex-col items-center self-center xl:my-24 xl:-mr-10 xl:ml-10 xl:flex-1 xl:items-start">
        <h1 className="text-6xl md:text-8xl">
          @waves/cn
        </h1>
        <p className="my-8 text-center text-2xl md:text-3xl xl:text-left">
          A collection of waveform components
          <br />
           built with wavesurfer.js and shadcn/ui.
        </p>
        <nav className="flex flex-wrap gap-4">
          <Link
            href="/docs"
            className={cn(
              buttonVariants({
                size: 'lg'
              }),
              'text-md w-full rounded-full sm:w-auto'
            )}
          >
            <Library className="mr-2 inline-block" size={20} />
            Documentation
          </Link>
          <a
            href="https://github.com/Ziane-Badreddine/waves-cn"
            className={cn(
              buttonVariants({
                size: 'lg',
                variant: 'secondary'
              }),
              'text-md w-full rounded-full sm:w-auto'
            )}
          >
            <Github className="mr-2 -ml-1 inline-block" size={20} />
            GitHub
          </a>
        </nav>
         <div className="-space-x-2 -translate-y-1.5 md:-translate-y-2.5 inline-flex items-center justify-center mt-7">
            {icons.map((icon, index) => (
              <Tooltip key={icon.name}>
                <TooltipTrigger asChild>
                  <div
                    className="inline-flex size-8 items-center justify-center rounded-full text-white sm:size-10 md:size-12 lg:size-12"
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
      </aside>
      <aside className="relative my-4 xl:my-auto xl:flex-1 xl:pt-4">
        <ComponentPreviewWrapper
          name="wave-video-demo"
        />
      </aside>
      <div
        className="absolute right-0 -bottom-12 left-0 hidden h-12 items-center justify-center xl:flex"
        aria-hidden
      >
        <ChevronDown />
      </div>
    </section>
  )
}