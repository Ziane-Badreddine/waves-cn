import { HomeLayoutProps } from "@/components/layout/home";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon } from "lucide-react";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "fuma-nama",
  repo: "fumadocs",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "@waves/cn",
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    
  };
}


export function homeOptions(): HomeLayoutProps {
  return {
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        icon: <BookIcon />,
        text: "Documentation",
        url: "/docs",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
      {
        icon: <BookIcon />,
        text: "Blog",
        url: "/blog",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
    ],
    ...baseOptions()
  };
}
