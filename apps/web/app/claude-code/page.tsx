import { CodeExample } from "@/components/code-example";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { Shot } from "@/components/shot";
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
        <section className="max-w-3xl space-y-4 text-[15px] leading-7">
          <h2 className="text-2xl tracking-tight">Localhost is a normal target</h2>
          <p>
            Start the dev server, open that exact URL in Chrome, and set the window to the width where the bug shows. The copied prompt includes the URL and the viewport, so Claude Code knows you meant the page at 390px wide, not the desktop layout. You do not point the extension at the repository. Claude Code still needs the repo. EditUI only names the elements on the running page.
          </p>
          <Shot caption="Edit Mode on a localhost page: one element outlined, a short note, and the review tray still open so the next click can join the batch." />
        </section>
        <section className="max-w-3xl space-y-4 text-[15px] leading-7">
          <h2 className="text-2xl tracking-tight">Batch, then one paste</h2>
          <p>
            A visual pass is rarely one element. Click the heading, the cards, the button. Write the outcome on each. Copy all builds a single prompt with a numbered section per edit. Paste that once into Claude Code, in the project that renders the page. EditUI does not call the model, open a pull request, or keep a connection to Claude Code.
          </p>
          <p>A shortened example of what lands on the clipboard:</p>
          <CodeExample code={samplePrompt} />
          <p>
            Ask Claude Code to implement the list and then check the page against each note. After hot reload, look at the same URL. Send a follow-up only for the notes that missed.
          </p>
        </section>
        <RelatedPosts
          links={[
            { href: "/blog/visual-edit-ui-claude-code", label: "How to visually edit UI with Claude Code" },
            { href: "/blog/click-element-send-claude-code", label: "Click an element and send it to Claude Code" },
            { href: "/cursor", label: "The same pointing workflow next to Cursor Design Mode" },
            { href: "/blog/mcp-pickers-vs-copy-paste", label: "MCP element pickers vs a copied batch" },
            { href: "/chrome-extension", label: "Chrome extension" },
          ]}
        />
      </div>
    </>
  );
}
