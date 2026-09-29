import Link from "next/link";
import { relatedBySlug, type RelatedLink } from "@/data/related";

export function RelatedPosts({ slug, links }: { slug?: string; links?: RelatedLink[] }) {
  const items = links ?? (slug ? relatedBySlug[slug] : undefined);
  if (!items?.length) return null;

  return (
    <aside className="mt-12 border-t border-line pt-8">
      <h2 className="text-sm font-medium">Continue</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-accent underline decoration-accent/30 underline-offset-4">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
