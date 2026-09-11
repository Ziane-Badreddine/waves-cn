"use client";

import { Check, Copy, Terminal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function InstallCommand({
  command = "npx shadcn@latest add @waves-cn/wave-player",
  className,
}: {
  command?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // clipboard unavailable
    }
  }, [command]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy install command"
      className={cn(
        "group inline-flex max-w-full items-center gap-3 rounded-full border bg-background/80 py-2 pl-4 pr-2 font-mono text-sm text-foreground shadow-xs backdrop-blur transition-colors hover:bg-muted",
        className,
      )}
    >
      <Terminal className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">
        <span className="text-muted-foreground">$ </span>
        {command}
      </span>
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
        {copied ? (
          <Check className="size-3.5 text-emerald-500" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </span>
    </button>
  );
}
