import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { SITE_URL } from "@/lib/site";

export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: `${SITE_URL}${page.url}`,
    changeFrequency: "weekly" as const,
    priority: page.slugs.length === 0 ? 0.9 : 0.7,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...docs,
  ];
}
