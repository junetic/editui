import { CodeExample } from "@/components/code-example";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { Steps } from "@/components/steps";
import { samplePrompt } from "@/data/demos";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Claude Code Visual UI Editor | EditUI",
  description:
    "Click elements in your running app, collect UI changes while you review, and send the complete context to Claude Code.",
  path: "/claude-code",
});

const steps = [
  { name: "Run your app", text: "Start the dev server you already use." },
  { name: "Open it in Chrome", text: "Use the normal browser, including localhost." },
  { name: "Turn on EditUI", text: "Toolbar icon, or Command-Shift-E." },
  { name: "Click an element", text: "The outline is the thing you mean." },
  { name: "Describe the change", text: "Write the outcome, not a tour of the DOM." },
  { name: "Keep adding edits", text: "Stay in the review until the page is covered." },
  { name: "Copy the batch", text: "Paste the prompt into Claude Code, in the repo that renders this page." },
  { name: "Review the result", text: "When the app reloads, check the same elements." },
];

export default function ClaudeCodePage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Claude Code" },
        ]}
        eyebrow="Claude Code"
        title="A visual UI layer for Claude Code"
        lede="Click elements in your running app, attach specific UI changes, collect them while you review, then send the complete context to Claude Code."
        ctaLocation="claude-code-hero"
      />
      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-20">
        <section>
          <h2 className="text-2xl tracking-tight">How to visually edit UI with Claude Code</h2>
          <div className="mt-6">
            <Steps steps={steps} showShorthand={false} />
          </div>
        </section>
        <section className="max-w-3xl">
          <h2 className="text-2xl tracking-tight">What Claude Code receives</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            EditUI does not call Claude for you. Copy all puts one prompt on the clipboard. You paste it into Claude Code. The prompt names the page, the viewport, each request, and the element you clicked: tag, text, nearby markup, and a few computed styles.
          </p>
          <div className="mt-6">
            <CodeExample code={samplePrompt} />
          </div>
        </section>
        <RelatedPosts
          links={[
            { href: "/blog/visual-edit-ui-claude-code", label: "How to visually edit UI with Claude Code" },
            { href: "/blog/click-element-send-claude-code", label: "Click an element and send it to Claude Code" },
            { href: "/chrome-extension", label: "Chrome extension" },
          ]}
        />
      </div>
    </>
  );
}
