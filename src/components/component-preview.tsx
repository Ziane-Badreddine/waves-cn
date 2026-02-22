"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Index } from "@/__registry__";
import { Icons } from "./icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  codeString?: string | null;

  /**
   * normal -> preview + code (tabs)
   * preview -> preview only
   * codesource -> code only
   */
  variant?: "normal" | "preview" | "codesource";
}

export function ComponentPreview({
  name,
  className,
  align = "center",
  hideCode = false,
  codeString,
  variant = "normal",
  ...props
}: ComponentPreviewProps) {
  const Component = Index[name]?.component;

  const Preview = React.useMemo(() => {
    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      );
    }

    return <Component />;
  }, [Component, name]);

  // ==============================
  // CODE ONLY
  // ==============================

  if (variant === "codesource" && codeString) {
    return (
      <div className={cn("my-4", className)} {...props}>
        <DynamicCodeBlock lang="tsx" code={codeString} />
      </div>
    );
  }

  // ==============================
  // PREVIEW ONLY
  // ==============================
  if (variant === "preview") {
    return (
      <div
        className={cn("my-4 flex items-center justify-center p-4", className)}
        {...props}
      >
        <React.Suspense
          fallback={
            <div className="flex items-center text-sm text-muted-foreground">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </div>
          }
        >
          {Preview}
        </React.Suspense>
      </div>
    );
  }

  // ==============================
  // NORMAL (Tabs)
  // ==============================
  return (
    <div
      className={cn("group relative my-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative w-full">
        <div className="flex items-center justify-between">
          {!hideCode && codeString && (
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          )}
        </div>

        {/* PREVIEW */}
        <TabsContent value="preview">
          <div
            className={cn(
              "flex h-full p-4",
              align === "center" && "justify-center",
              align === "start" && "justify-start",
              align === "end" && "justify-end",
            )}
          >
            <React.Suspense
              fallback={
                <div className="flex items-center text-sm text-muted-foreground">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              }
            >
              {Preview}
            </React.Suspense>
          </div>
        </TabsContent>

        {/* CODE */}
        {codeString && (
          <TabsContent value="code" className="pb-0">
            <DynamicCodeBlock lang="tsx" code={codeString} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
