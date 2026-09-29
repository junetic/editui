import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { Steps } from "@/components/steps";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Visual UI Feedback for Codex | EditUI",
  description: "Collect element-specific UI edits in Chrome and paste one prompt into Codex.",
  path: "/codex",
});

const steps = [
  { name: "Review in Chrome", text: "Open the running page and turn on EditUI." },
  { name: "Point and prompt", text: "Click each element and write the change." },
  { name: "Copy all", text: "The batch becomes one prompt on your clipboard." },
  { name: "Paste into Codex", text: "Give Codex the repo that renders the page, and paste the review." },
  { name: "Check the reload", text: "Look at the same URL after the code changes land." },
];

export default function CodexPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Codex" },
        ]}
        eyebrow="Codex"
        title="Visual UI feedback for Codex"
        lede="EditUI does not ship a Codex plugin. It copies a prompt from the page you are looking at, and you paste that prompt into Codex."
        ctaLocation="codex-hero"
      />
      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-20">
        <section>
          <h2 className="text-2xl tracking-tight">The Codex workflow</h2>
          <div className="mt-6">
            <Steps steps={steps} showShorthand={false} />
          </div>
        </section>
        <section className="max-w-3xl text-sm leading-6 text-muted">
          <p>
            Codex still needs the repository. EditUI’s job is the part Codex cannot see: which element you meant, on which URL, at which viewport, and what you wanted changed. The notes stay on your machine until you paste them.
          </p>
        </section>
        <RelatedPosts
          links={[
            { href: "/chrome-extension", label: "Chrome extension" },
            { href: "/visual-ui-editor", label: "Visual UI editing for coding agents" },
            { href: "/blog/visual-context-coding-agents", label: "How to give coding agents better visual context" },
          ]}
        />
      </div>
    </>
  );
}
