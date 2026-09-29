import type { MetadataRoute } from "next";
import { pages, site } from "@/data/site";
import { getPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = pages.map((page) => ({
    url: new URL(page.path, site.url).toString(),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: page.priority,
  }));
  const posts = getPosts().map((post) => ({
    url: new URL(`/blog/${post.slug}`, site.url).toString(),
    lastModified: new Date(`${post.updated}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...posts];
}
