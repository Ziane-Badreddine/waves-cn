"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SiGithub } from "react-icons/si";

const contributors = [
  {
    name: "Badreddine Ziane",
    username: "Ziane-Badreddine",
    role: "Creator & maintainer",
    avatar: "https://github.com/Ziane-Badreddine.png",
    url: "https://github.com/Ziane-Badreddine",
  },
  {
    name: "Mouad Sadik",
    username: "MouadSadik",
    role: "Creator & maintainer",
    avatar: "https://github.com/MouadSadik.png",
    url: "https://github.com/MouadSadik",
  },
];

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export function ContributorsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Left: copy + CTA */}
        <motion.div {...reveal} transition={{ duration: 0.5 }} className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Open source
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Built in the open, by people who ship audio UI
          </h2>
          <p className="max-w-xl text-balance text-base text-muted-foreground md:text-lg">
            waves-cn is MIT licensed and maintained on GitHub. Fix a bug, add a
            plugin wrapper, improve a doc page. Every pull request is welcome.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full">
              <Link
                href="https://github.com/Ziane-Badreddine/waves-cn"
                target="_blank"
                rel="noreferrer"
              >
                <Heart className="size-4" />
                Become a contributor
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link
                href="https://github.com/Ziane-Badreddine/waves-cn/issues"
                target="_blank"
                rel="noreferrer"
              >
                Open an issue
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Right: contributor cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {contributors.map((c, index) => (
            <motion.a
              key={c.username}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              {...reveal}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.3)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-muted/80 to-transparent"
              />
              <Avatar className="relative size-20 ring-4 ring-background">
                <AvatarImage src={c.avatar} alt={c.name} />
                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="relative space-y-1">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>

              <span className="relative inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                <SiGithub className="size-3.5" />@{c.username}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
