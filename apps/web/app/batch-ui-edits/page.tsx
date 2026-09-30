import { EditQueue } from "@/components/edit-queue";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { pageBatch } from "@/data/demos";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Batch UI Changes for Coding Agents | EditUI",
  description:
    "Collect every UI note on a page, then send one review to Claude Code, Cursor, Codex, or any coding agent.",
  path: "/batch-ui-edits",
});

export default function BatchPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Batch UI edits" },
        ]}
        eyebrow="Batch UI edits"
        title="Batch UI changes before sending them to your coding agent"
        lede="You are reviewing a page and notice twelve little things. Sending twelve separate prompts breaks your concentration and wastes the review."
        ctaLocation="batch-hero"
      />
      <div className="mx-auto grid max-w-5xl gap-10 px-6 pb-20 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="max-w-xl space-y-4 text-sm leading-6 text-muted">
          <p>
            A batch is the review, not a pile of tickets. Walk the page once. Click the hero, the navigation, a pricing card, the button, the footer. Write the change next to each one. Then copy the list.
          </p>
          <p>
            The agent gets the notes together, so it can keep the page coherent: one spacing rhythm, one button weight, one mobile layout. You get your attention back.
          </p>
          <RelatedPosts
            links={[
              { href: "/blog/batch-ui-changes-ai", label: "How to batch UI changes with AI coding agents" },
              { href: "/blog/mcp-pickers-vs-copy-paste", label: "MCP pickers vs a copied batch" },
              { href: "/cursor", label: "Cursor Design Mode in Chrome" },
              { href: "/visual-ui-editor", label: "Visual UI editing" },
              { href: "/chrome-extension", label: "Chrome extension" },
            ]}
          />
        </div>
        <EditQueue items={pageBatch} action="Send review →" />
      </div>
    </>
  );
}
