import { Flow } from "@/components/comparison";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { contextFlow } from "@/data/comparisons";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Visual UI Editor for Coding Agents | EditUI",
  description:
    "Point at a running interface, attach the change you want, and hand a coding agent the element plus your intent.",
  path: "/visual-ui-editor",
});

export default function VisualUiEditorPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Visual UI editor" },
        ]}
        eyebrow="Visual UI editor"
        title="Visual UI editing for coding agents"
        lede="The useful shift is not another website builder. It is pointing at the interface you already shipped and letting the agent change that, specifically."
        ctaLocation="visual-ui-editor-hero"
      />
      <div className="mx-auto max-w-5xl space-y-16 px-6 pb-20">
        <section className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">Without a pointer</h2>
            <div className="mt-4">
              <Flow steps={contextFlow.before} />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-medium">With EditUI</h2>
            <div className="mt-4">
              <Flow steps={contextFlow.after} />
            </div>
          </div>
        </section>
        <section className="max-w-3xl space-y-3 text-sm leading-6 text-muted">
          <p>
            A visual editor for a coding agent is a way to name the element. You stay in the browser, click the thing that looks wrong, and write the change in the same words you would say to a designer sitting next to you.
          </p>
          <p>
            EditUI keeps those notes on the page, then copies them as one prompt. It is not a canvas, a site generator, or a replacement for the agent that edits the code.
          </p>
        </section>
        <RelatedPosts
          links={[
            { href: "/batch-ui-edits", label: "Batch UI edits" },
            { href: "/chrome-extension", label: "Chrome extension" },
            { href: "/blog/polish-ai-generated-ui", label: "Polish the last 10% of AI-generated UI" },
          ]}
        />
      </div>
    </>
  );
}
