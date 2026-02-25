"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Heart } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

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
]

export function ContributorsSection() {
  return (
    <section className="relative py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            >
              <Card className="hover:shadow-xl transition-all duration-300 border">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={contributor.avatar} />
                    <AvatarFallback>
                      {contributor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {contributor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      @{contributor.username}
                    </p>
                  </div>

                  <Link href={contributor.url} target="_blank">
                    <Button variant="outline" size="sm">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call To Contribute */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 space-y-6"
        >
          <div className="text-xl font-semibold">
            Want to contribute?
          </div>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Help us improve components, fix bugs, add new features, or enhance
            documentation. Every contribution matters.
          </p>

          <Link href="https://github.com/Ziane-Badreddine/waves-cn" target="_blank">
            <Button size="lg" className="rounded-2xl">
              <Heart className="mr-2 h-5 w-5" />
              Become a Contributor
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}