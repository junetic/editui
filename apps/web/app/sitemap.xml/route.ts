import { pages, site } from "@/data/site";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-static";

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function entry(loc: string, lastModified: string, changeFrequency: string, priority: number): string {
  return [
    "<url>",
    `<loc>${xmlEscape(loc)}</loc>`,
    `<lastmod>${lastModified}</lastmod>`,
    `<changefreq>${changeFrequency}</changefreq>`,
    `<priority>${priority}</priority>`,
    "</url>",
  ].join("");
}

export function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    ...pages.map((page) =>
      entry(new URL(page.path, site.url).toString(), today, "weekly", page.priority),
    ),
    ...getPosts().map((post) =>
      entry(new URL(`/blog/${post.slug}`, site.url).toString(), post.updated, "monthly", 0.6),
    ),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
