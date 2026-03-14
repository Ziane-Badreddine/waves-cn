import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentPreview } from "@/components/component-preview";
import { ComponentPreviewWrapper } from "@/components/component-preview-wrapper";
import { Step, Steps } from "@/components/steps";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tab,
} from "@/components/tabs";
import { CodeBlock, Pre } from "./components/codeblock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Grid from "@/components/grid";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ComponentPreviewWrapper,
    ComponentPreview,
    Steps,
    Step,
    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Button,
    Grid,
    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    table: ({ className, ...props }: React.ComponentProps<"table">) => (
      <div className="w-full overflow-x-auto">
        <table
          className={cn(
            "w-full rounded [&_tbody_tr:last-child]:border-b-0 my-0!",
            className,
          )}
          {...props}
        />
      </div>
    ),
    tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
      <tr className={cn("m-0 border-b", className)} {...props} />
    ),
    th: ({ className, ...props }: React.ComponentProps<"th">) => (
      <th
        className={cn(
          "px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: React.ComponentProps<"td">) => (
      <td
        className={cn(
          "px-4 py-2 text-left whitespace-nowrap [&[align=center]]:text-center [&[align=right]]:text-right",
          className,
        )}
        {...props}
      />
    ),
  };
}
