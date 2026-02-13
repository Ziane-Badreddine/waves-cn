import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ComponentPreview } from "@/components/component-preview";
import {ComponentPreviewWrapper} from "@/components/component-preview-wrapper";
import {  Step,Steps} from "@/components/steps";
import {Tabs,TabsContent,TabsList, TabsTrigger } from "@/components/tabs";
import { CodeBlock, Pre } from './components/codeblock';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    ComponentPreviewWrapper,
    ComponentPreview,
    Steps,
    Step,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  };
}
