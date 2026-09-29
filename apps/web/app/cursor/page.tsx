import { Comparison } from "@/components/comparison";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { cursorComparison } from "@/data/comparisons";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Cursor Design Mode Alternative for Chrome | EditUI",
  description:
    "Review your running UI in Chrome, collect element-specific edits, and hand the complete review to Cursor or any other coding agent.",
  path: "/cursor",
});

export default function CursorPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Cursor" },
        ]}
        eyebrow="Cursor"
        title="Cursor-style visual prompting, in your normal browser"
        lede="Use EditUI when you want to review your running UI in Chrome, collect element-specific edits, and hand the complete review to your coding agent."
        ctaLocation="cursor-hero"
      />
      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-20">
        <section className="max-w-3xl">
          <h2 className="text-2xl tracking-tight">A different workflow</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Cursor Design Mode lives in the browser inside Cursor’s Agents Window. You click an element, and Cursor can attach that element’s identity plus a screenshot to its own agent. That is a strong loop when you are already working in Cursor.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">
            EditUI is for the review you do in normal Chrome. You collect the notes first, then copy one prompt. Paste it into Cursor, or into Claude Code, Codex, or another agent. EditUI does not map the DOM node to a React fiber, and it does not capture a screenshot.
          </p>
        </section>
        <Comparison columns={cursorComparison} />
        <RelatedPosts
          links={[
            { href: "/blog/cursor-design-mode-guide", label: "Cursor Design Mode: how it works" },
            { href: "/chrome-extension", label: "Chrome extension" },
            { href: "/batch-ui-edits", label: "Collect a batch before you send it" },
          ]}
        />
      </div>
    </>
  );
}
