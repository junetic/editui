import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface PostMeta {
  title: string;
  description: string;
  slug: string;
  published: string;
  updated: string;
}

const order = [
  "visual-edit-ui-claude-code",
  "click-element-send-claude-code",
  "cursor-design-mode-guide",
  "batch-ui-changes-ai",
  "polish-ai-generated-ui",
  "visual-context-coding-agents",
];

const contentDir = path.join(process.cwd(), "content/blog");

function readPost(fileName: string): { meta: PostMeta; body: string } | null {
  const raw = fs.readFileSync(path.join(contentDir, fileName), "utf8");
  const { data, content } = matter(raw);
  if (!isMeta(data)) return null;
  return {
    meta: {
      title: data.title,
      description: data.description,
      slug: data.slug,
      published: data.published,
      updated: data.updated || data.published,
    },
    body: content,
  };
}

function isMeta(data: unknown): data is { title: string; description: string; slug: string; published: string; updated?: string } {
  if (typeof data !== "object" || data === null) return false;
  const post = data as Record<string, unknown>;
  return (
    typeof post.title === "string" &&
    typeof post.description === "string" &&
    typeof post.slug === "string" &&
    typeof post.published === "string"
  );
}

export function getPosts(): PostMeta[] {
  const posts = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => readPost(file)?.meta)
    .filter((post): post is PostMeta => Boolean(post));

  return posts.sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export function getPost(slug: string): { meta: PostMeta; body: string } | null {
  const fileName = `${slug}.mdx`;
  if (!fs.existsSync(path.join(contentDir, fileName))) return null;
  return readPost(fileName);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
