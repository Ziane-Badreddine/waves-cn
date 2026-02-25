"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Heart } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { SiGithub } from "react-icons/si";

const contributors = [
  {
    name: "Badreddine Ziane",
    username: "Ziane-Badreddine",
    avatar: "https://github.com/Ziane-Badreddine.png",
    url: "https://github.com/Ziane-Badreddine",
  },
  {
    name: "Mouad Sadik",
    username: "MouadSadik",
    avatar: "https://github.com/MouadSadik.png",
    url: "https://github.com/MouadSadik",
  },
];

export function ContributorsSection() {
  return (
    <section className="relative py-24 px-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Built by the Community
        </motion.h2>

        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our library grows thanks to amazing developers who believe in
          open-source and beautiful UI components.
        </p>

        {/* Contributors Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 mt-12">
          {contributors.map((contributor, index) => (
            <motion.div
              key={contributor.username}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "my-4 flex items-center justify-center p-4",
                "relative flex size-full flex-col items-center justify-center gap-4 overflow-hidden p-8 [--primary-foreground:oklch(0.985_0_0)] [--primary:oklch(0.205_0_0)] dark:[--primary-foreground:oklch(0.205_0_0)] dark:[--primary:oklch(0.985_0_0)] bg-card",
              )}
            >
              <div className="-translate-y-px absolute top-8 right-0 left-0 border border-primary  border-dashed" />
              <div className="absolute right-0 bottom-8 left-0 translate-y-px border border-primary border-dashed" />
              <div className="-translate-x-px absolute top-0 bottom-0 left-8 border border-primary border-dashed" />
              <div className="absolute top-0 right-8 bottom-0 translate-x-px border border-primary border-dashed" />
              <Avatar className="size-20 mt-6">
                <AvatarImage src={contributor.avatar} />
                <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="text-center">
                <h3 className="font-semibold text-lg">{contributor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  @{contributor.username}
                </p>
              </div>

              <Link href={contributor.url} target="_blank" className="mb-6">
                <Button variant="outline" size="sm">
                  <SiGithub className="size-4" />
                  GitHub
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call To Contribute */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 space-y-6"
          viewport={{ once: true }}
        >
          <div className="text-xl font-semibold">Want to contribute?</div>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Help us improve components, fix bugs, add new features, or enhance
            documentation. Every contribution matters.
          </p>

          <Link
            href="https://github.com/Ziane-Badreddine/waves-cn"
            target="_blank"
          >
            <Button className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer">
              <span className="relative z-10 transition-all duration-500">
                Become a Contributor
              </span>
              <div className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                <Heart className="size-5" />
              </div>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
