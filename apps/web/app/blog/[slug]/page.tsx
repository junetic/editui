import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx";
import { RelatedPosts } from "@/components/related-posts";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/metadata";
import { formatDate, getPost, getPosts } from "@/lib/posts";

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.meta.title,
    description: post.meta.description,
    path: `/blog/${post.meta.slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = new URL(`/blog/${post.meta.slug}`, site.url).toString();
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.published,
    dateModified: post.meta.updated,
    mainEntityOfPage: url,
    author: {
      "@type": "Organization",
      name: "EditUI",
    },
    publisher: {
      "@type": "Organization",
      name: "EditUI",
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <JsonLd data={article} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/blog", label: "Blog" },
          { label: post.meta.title },
        ]}
      />
      <header className="mt-8">
        <p className="text-sm text-muted">{formatDate(post.meta.published)}</p>
        <h1 className="mt-3 text-4xl leading-tight tracking-tight">{post.meta.title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">{post.meta.description}</p>
      </header>
      <div className="mdx mt-8">
        <MDXRemote source={post.body} components={mdxComponents} />
      </div>
      <RelatedPosts slug={post.meta.slug} />
    </article>
  );
}
