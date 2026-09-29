import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatDate, getPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "EditUI blog",
  description: "Guides on visual UI editing, Claude Code, Cursor Design Mode, and batching frontend changes for coding agents.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getPosts();
  return (
    <section className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { label: "Blog" },
        ]}
      />
      <h1 className="mt-8 text-4xl tracking-tight">Notes on visual UI feedback</h1>
      <p className="mt-4 text-lg leading-8 text-muted">Short guides for pointing at a running interface and handing that review to a coding agent.</p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <p className="text-sm text-muted">{formatDate(post.published)}</p>
            <h2 className="mt-2 text-xl tracking-tight">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{post.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
