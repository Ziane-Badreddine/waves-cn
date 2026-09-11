import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { Logo } from "@/components/layout/navbar/logo";

const columns: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Docs",
      links: [
        { label: "Introduction", href: "/docs" },
        { label: "Installation", href: "/docs/installation" },
        { label: "useWavesurfer", href: "/docs/use-wavesurfer" },
        { label: "Plugins", href: "/docs/plugins" },
      ],
    },
    {
      title: "Components",
      links: [
        { label: "Wave Player", href: "/docs/components/wave-player" },
        { label: "Wave Recorder", href: "/docs/components/wave-recorder" },
        { label: "Wave Regions", href: "/docs/components/wave-regions" },
        { label: "Wave Spectrogram", href: "/docs/components/wave-spectrogram" },
      ],
    },
    {
      title: "Community",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/Ziane-Badreddine/waves-cn",
        },
        {
          label: "Issues",
          href: "https://github.com/Ziane-Badreddine/waves-cn/issues",
        },
        { label: "X / Twitter", href: "https://x.com/wavescn0" },
      ],
    },
  ];

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Waveform components for React, built on wavesurfer.js and
              shadcn/ui.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/Ziane-Badreddine/waves-cn"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground"
              >
                <SiGithub className="size-4" />
              </Link>
              <Link
                href="https://x.com/wavescn0"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="inline-flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground"
              >
                <SiX className="size-4" />
              </Link>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      {...(l.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            Built by{" "}
            <Link
              href="https://github.com/MouadSadik"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Mouad Sadik
            </Link>{" "}
            and{" "}
            <Link
              href="https://github.com/Ziane-Badreddine"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Badreddine Ziane
            </Link>
            .
          </p>
          <p>MIT licensed. Open source on GitHub.</p>
        </div>
      </div>
    </footer>
  );
}
