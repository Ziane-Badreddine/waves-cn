"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import {
  SiLucide,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiShadcnui,
} from "@icons-pack/react-simple-icons";
import { SiGithub } from "react-icons/si";
import { GiWaveSurfer } from "react-icons/gi";
import WaveHero from "./wave-hero";
import { HeroBackdrop } from "./hero-backdrop";
import { InstallCommand } from "./install-command";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/kibo-ui/announcement";

const stack = [
  { icon: SiReact, name: "React", color: "#087ea4" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178c6" },
  { icon: SiTailwindcss, name: "Tailwind CSS", color: "#00bcff" },
  { icon: SiShadcnui, name: "shadcn/ui", color: "currentColor" },
  { icon: SiLucide, name: "Lucide", color: "#f67373" },
  { icon: GiWaveSurfer, name: "wavesurfer.js", color: "#7F00FF" },
];

const stats = [
  { value: "11", label: "components" },
  { value: "1", label: "install command" },
  { value: "100%", label: "TypeScript" },
  { value: "MIT", label: "licensed" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// Syntax-highlighted usage snippet (hand-tokenised, no runtime highlighter).
function CodePanel() {
  const kw = "text-fuchsia-600 dark:text-fuchsia-400";
  const str = "text-emerald-600 dark:text-emerald-400";
  const tag = "text-sky-600 dark:text-sky-400";
  const attr = "text-amber-600 dark:text-amber-300";
  const dim = "text-muted-foreground";

  return (
    <pre className="overflow-x-auto font-mono text-[12.5px] leading-[1.7] text-foreground/90">
      <code>
        <span className={kw}>import</span> WavePlayer{" "}
        <span className={kw}>from</span>{" "}
        <span className={str}>&quot;@/components/waves-cn/wave-player&quot;</span>;
        {"\n\n"}
        <span className={kw}>export default function</span>{" "}
        <span className={tag}>Page</span>() {"{"}
        {"\n"}
        {"  "}
        <span className={kw}>return</span> ({"\n"}
        {"    "}
        <span className={dim}>&lt;</span>
        <span className={tag}>WavePlayer</span>
        {"\n"}
        {"      "}
        <span className={attr}>src</span>=
        <span className={str}>&quot;/coastline.mp3&quot;</span>
        {"\n"}
        {"      "}
        <span className={attr}>title</span>=
        <span className={str}>&quot;Coastline&quot;</span>
        {"\n"}
        {"    "}
        <span className={dim}>/&gt;</span>
        {"\n"}
        {"  "});{"\n"}
        {"}"}
      </code>
    </pre>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Dotted backdrop, fading out toward the bottom */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_30%,transparent_100%)]"
      />
      {/* Soft top glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[-12rem] -z-10 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl dark:bg-primary/[0.09]"
      />
      <HeroBackdrop />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
        className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 text-center md:px-6 md:pt-24"
      >
        <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
          <Announcement className="mb-8">
            <AnnouncementTag>New</AnnouncementTag>
            <Link href="/docs/components/wave-regions">
              <AnnouncementTitle>
                Regions, Minimap, Spectrogram, Hover &amp; Envelope
                <ArrowUpRightIcon
                  className="shrink-0 text-muted-foreground"
                  size={16}
                />
              </AnnouncementTitle>
            </Link>
          </Announcement>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="text-balance text-5xl font-semibold leading-[1.02] tracking-tighter md:text-7xl"
        >
          Waveform components
          <br />
          <span className="bg-linear-to-r from-foreground/40 via-foreground to-foreground/40 bg-clip-text text-transparent">
            built to be copied.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-xl"
        >
          A collection of audio UI built with{" "}
          <span className="font-medium text-foreground">wavesurfer.js</span>{" "}
          and <span className="font-medium text-foreground">shadcn/ui</span>.
          Install with one command, own the code, style it with your tokens.
        </motion.p>

        <motion.nav
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            href="/docs"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-11 w-full rounded-full px-6 text-base sm:w-auto",
            )}
          >
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="https://github.com/Ziane-Badreddine/waves-cn"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-11 w-full rounded-full px-6 text-base sm:w-auto",
            )}
          >
            <SiGithub className="size-4" />
            GitHub
          </a>
        </motion.nav>

        <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
          <InstallCommand className="mt-5" />
        </motion.div>
      </motion.div>

      {/* Stage: browser window with code + live player */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-14 max-w-5xl px-4 md:mt-20 md:px-6"
      >
        <div className="relative rounded-[1.75rem] border bg-linear-to-b from-muted/70 to-muted/20 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] dark:from-white/[0.06] dark:to-white/[0.02]">
          <div className="relative overflow-hidden rounded-[1.25rem] border bg-card">
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex h-6 w-full max-w-xs items-center justify-center rounded-md border bg-background/70 font-mono text-[11px] text-muted-foreground">
                localhost:3000
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
              <div className="hidden flex-col border-r bg-muted/20 md:flex">
                <div className="flex items-center gap-2 border-b px-4 py-2 text-[11px] text-muted-foreground">
                  <span className="rounded-md border bg-background px-2 py-0.5 font-mono text-foreground">
                    page.tsx
                  </span>
                  <span className="font-mono">app/</span>
                </div>
                <div className="p-5">
                  <CodePanel />
                </div>
              </div>

              <div className="p-5 md:p-7">
                <WaveHero />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <dl className="mx-auto mt-10 grid max-w-3xl grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-0.5 px-4 py-2"
            >
              <dd className="text-2xl font-semibold tracking-tight md:text-3xl">
                {s.value}
              </dd>
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>

        {/* Stack */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Built with
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {stack.map((item) => (
              <li
                key={item.name}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <item.icon className="size-4" style={{ color: item.color }} />
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
