import { HomeLayoutProps } from "@/components/layout/home";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon } from "lucide-react";
import { SiReadthedocs } from "react-icons/si";
import { ImBlog } from "react-icons/im";

// fill this with your actual GitHub info, for example:
// export const gitConfig = {
//   user: "fuma-nama",
//   repo: "fumadocs",
//   branch: "main",
// };

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "@waves/cn",
    },
    githubUrl: `https://github.com/Ziane-Badreddine/waves-cn`,

    links: [
      {
        icon: <SiReadthedocs />,
        text: "Documentation",
        url: "/docs",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
      {
        icon: <ImBlog />,
        text: "Blog",
        url: "/blog",
        // secondary items will be displayed differently on navbar
        secondary: false,
      },
    ],
  };
}

export function homeOptions(): HomeLayoutProps {
  return {
    githubUrl: `https://github.com/Ziane-Badreddine/waves-cn`,
    ...baseOptions(),
  };
}
