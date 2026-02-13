"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Index } from "@/__registry__";
import { Icons } from "./icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';


interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  align?: "center" | "start" | "end";
  hideCode?: boolean;
  codeString?: string | null;
}

export function ComponentPreview({
  name,
  className,
  align = "center",
  hideCode = false,
  codeString,
  ...props
}: ComponentPreviewProps) {
  console.log(codeString);
  const Preview = React.useMemo(() => {
    const Component = Index[name]?.component;

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
  }, [name]);

  return (
    <div
      className={cn("group relative my-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full ">
        <div className="flex items-center justify-between">
          {!hideCode && codeString && (
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          )}
        </div>

        {/* ================= PREVIEW ================= */}
        <TabsContent value="preview">
          <div
            className={cn(
              "flex h-full items-center justify-center p-4",

            )}
          >
            <React.Suspense
              fallback={
                <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              }
            >
              {Preview}
            </React.Suspense>
          </div>
        </TabsContent>

        {/* ================= CODE ================= */}
        {codeString && (
          <TabsContent value="code" className="pb-0">
           <DynamicCodeBlock lang="tsx" code={codeString}  />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
