import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps: { title: string; description: string; code: string }[] = [
  {
    title: "Register the registry",
    description:
      "Point the shadcn CLI at waves-cn once in your components.json.",
    code: `"registries": {
  "@waves-cn": "https://waves-cn.vercel.app/r/{name}.json"
}`,
  },
  {
    title: "Add a component",
    description:
      "The CLI copies the component and the shared wave-cn core into your project.",
    code: "npx shadcn@latest add @waves-cn/wave-player",
  },
  {
    title: "Use it",
    description:
      "Import from your own components folder and pass an audio source.",
    code: `import WavePlayer from "@/components/waves-cn/wave-player";

<WavePlayer src="/track.mp3" title="My track" />`,
  },
];

export function GetStarted() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Get started
            </p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Up and running in three steps
            </h2>
            <p className="text-balance text-base text-muted-foreground md:text-lg">
              Works with any existing shadcn/ui project. No extra provider, no
              global CSS to import.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/docs/installation">
              Full installation guide
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-5 rounded-2xl border bg-background p-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <pre className="mt-auto overflow-x-auto rounded-xl border bg-muted/60 p-4 font-mono text-[13px] leading-relaxed text-foreground">
                <code>{step.code}</code>
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
