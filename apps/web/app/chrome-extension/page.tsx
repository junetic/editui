import { CodeExample } from "@/components/code-example";
import { Faq } from "@/components/faq";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { Steps } from "@/components/steps";
import { samplePrompt } from "@/data/demos";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "EditUI Chrome Extension: Visual UI Feedback for Coding Agents",
  description:
    "Point at any element on your running website, describe the change, and copy the context for Claude Code, Cursor, Codex, or any coding agent.",
  path: "/chrome-extension",
});

const workflow = [
  { name: "Run your app", text: "Use the site you already have open. Localhost is fine." },
  { name: "Turn on Edit Mode", text: "Click the toolbar icon, or press Command-Shift-E (Ctrl-Shift-E)." },
  { name: "Click and write", text: "Select an element and describe the change. Add as many as you need." },
  { name: "Copy all", text: "One prompt leaves with the page, the elements, and your notes. Paste it into your agent." },
];

const faqs = [
  {
    q: "Does EditUI upload the page?",
    a: "No. Page context is processed locally by the extension. Notes stay in chrome.storage.local on your device. They leave the browser only when you press Copy all and paste the prompt into a tool you choose. No account is required.",
  },
  {
    q: "Do I need to connect a repository?",
    a: "No. Install the extension and start pointing. EditUI does not read your repo and does not edit source files. Your coding agent does that after you paste the prompt.",
  },
  {
    q: "Which agents does it work with?",
    a: "Any agent that can take a pasted prompt, including Claude Code, Cursor, and Codex. EditUI copies the review. It does not install itself into the agent.",
  },
  {
    q: "What does the extension store?",
    a: "The URL, viewport, and the elements you select: tag, visible text, classes, a short attribute list, nearby markup, a small set of computed styles, and the bounding box. Uninstalling the extension removes those notes.",
  },
];

export default function ChromeExtensionPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Chrome extension" },
        ]}
        eyebrow="Chrome extension"
        title="Edit UI directly from Chrome"
        lede="Point at any element on your running website, describe the change, and send the context to your coding agent."
        ctaLocation="chrome-extension-hero"
      />
      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-20">
        <section>
          <h2 className="text-2xl tracking-tight">The workflow</h2>
          <div className="mt-6">
            <Steps steps={workflow} showShorthand={false} />
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">Works on your existing app</h2>
            <p className="mt-2 text-sm leading-6 text-muted">No special browser or visual builder. Review the page that is already running.</p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">No repo setup</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Install the extension and start pointing. There is nothing to add to the project.</p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">Batch your edits</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Review an entire page before involving your agent, then copy the batch once.</p>
          </article>
          <article className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">Agent agnostic</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Claude Code, Cursor, Codex, or the clipboard. The prompt is plain text.</p>
          </article>
        </section>
        <section>
          <h2 className="text-2xl tracking-tight">What you copy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Copy all builds one prompt: the URL, the viewport, each request, and the DOM context for the elements you clicked.
          </p>
          <div className="mt-6">
            <CodeExample code={samplePrompt} />
          </div>
        </section>
        <section>
          <h2 className="text-2xl tracking-tight">Privacy</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Your code stays your code. Page context is processed locally by the extension. EditUI has no account and no server. The content script stays inactive until you turn Edit Mode on.
          </p>
          <p className="mt-4 text-sm">
            <a href="/privacy" className="text-accent underline decoration-accent/30 underline-offset-4">
              Privacy policy
            </a>
          </p>
        </section>
        <Faq items={faqs} schema />
        <RelatedPosts
          links={[
            { href: "/claude-code", label: "Use EditUI with Claude Code" },
            { href: "/cursor", label: "A Chrome workflow next to Cursor Design Mode" },
            { href: "/blog/click-element-send-claude-code", label: "Click an element and send it to Claude Code" },
          ]}
        />
      </div>
    </>
  );
}
