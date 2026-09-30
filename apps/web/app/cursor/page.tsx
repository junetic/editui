import Link from "next/link";
import { ChromeCta } from "@/components/chrome-cta";
import { CompareTable } from "@/components/compare-table";
import { Faq } from "@/components/faq";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { Steps } from "@/components/steps";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Cursor Design Mode in Chrome, for Any Agent | EditUI",
  description:
    "A Cursor Design Mode style review in normal Chrome. Click the live UI, batch the notes, and paste one prompt into Cursor, Claude Code, Codex, or any coding agent.",
  path: "/cursor",
});

const rows = [
  {
    label: "Setup",
    cells: [
      "Open the browser in Cursor's Agents Window.",
      "Install the Chrome extension. No repo setup and no MCP server.",
    ],
  },
  {
    label: "Where it runs",
    cells: ["Inside Cursor.", "In normal Chrome, on the tab you already have open."],
  },
  {
    label: "Batch edits",
    cells: [
      "Send one edit and move on while Cursor's agent is still running.",
      "Collect the whole review, then copy one prompt.",
    ],
  },
  {
    label: "Agent",
    cells: ["Cursor's own agent.", "Whichever agent you paste into: Cursor, Claude Code, Codex, or another."],
  },
  {
    label: "Localhost",
    cells: ["Yes, loaded in Cursor's browser.", "Yes, including the localhost tab already open in Chrome."],
  },
  {
    label: "MCP",
    cells: ["Not required. The loop is built into Cursor.", "Not used. The handoff is a copied prompt."],
  },
];

const steps = [
  { name: "Run the app", text: "Use the dev server you already have. Leave it on the URL where the bug shows." },
  { name: "Open that URL in Chrome", text: "This can be localhost. Set the window to the width you care about before you click." },
  { name: "Turn on EditUI", text: "Toolbar icon, or Command-Shift-E (Ctrl-Shift-E)." },
  { name: "Click the element", text: "The outline is the thing you mean. Write the change in one sentence." },
  { name: "Keep collecting", text: "Stay in the review. Add the next note without starting an agent yet." },
  { name: "Copy all", text: "One prompt includes the URL, the viewport, each request, and the DOM context for each click." },
  { name: "Paste", text: "Put it in Cursor, Claude Code, Codex, or any agent that has the repo." },
  { name: "Check the reload", text: "When the page updates, look at the same elements. Re-prompt only the notes that missed." },
];

const faqs = [
  {
    q: "How does Cursor Design Mode work?",
    a: "Cursor documents Design Mode in the browser inside the Agents Window. Toggle it with Command-Shift-D (Ctrl-Shift-D). You can click an element, draw on the page, or describe a change by voice. Cursor says a picked element contributes its identity (xpath, component, attributes, computed styles, and React fiber props) plus a screenshot. The agent edits the code, and you can send another edit before the first one finishes.",
  },
  {
    q: "Is there a Cursor Design Mode alternative that runs in Chrome?",
    a: "EditUI is that workflow in normal Chrome. You click elements on the running page, write a note on each one, and copy the batch as one prompt. It does not draw on the page, take a screenshot, or read the React fiber tree. Those stay with Cursor Design Mode.",
  },
  {
    q: "What is the difference between Design Mode and Cursor's Visual Editor?",
    a: "Design Mode is visual prompting: point, draw, or talk, and Cursor's agent edits the code. The Visual Editor, described on Cursor's blog, also lives in the Cursor Browser and adds direct manipulation: drag elements, inspect component props, and adjust layout and type with sidebar controls, then ask the agent to apply the result. EditUI is neither. It is a Chrome review you paste into an agent. See the Visual Editor comparison for that split.",
  },
  {
    q: "Can I use this with Claude Code or Codex, not only Cursor?",
    a: "Yes. Copy all puts one prompt on the clipboard. Paste it into Claude Code, Codex, Cursor, or any agent that can read text. EditUI does not install itself into the agent.",
  },
  {
    q: "Does it work on localhost?",
    a: "Yes. Open the local URL in Chrome and turn Edit Mode on. The prompt includes that URL and the viewport size.",
  },
  {
    q: "Do I need MCP?",
    a: "No. There is no MCP server to configure and nothing to add to the repository. If you want the agent to pull element context itself through MCP, that is a different kind of tool.",
  },
  {
    q: "Does EditUI replace Cursor Design Mode?",
    a: "No. Use Design Mode when you are already in Cursor and you want its agent, its source mapping, and its screenshot. Use EditUI when the review is happening in Chrome, or when the agent is not Cursor.",
  },
];

export default function CursorPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { label: "Cursor Design Mode" },
        ]}
        eyebrow="Cursor Design Mode"
        title="Cursor Design Mode, in Chrome, for any coding agent"
        lede="You can see the UI bug in the browser. The agent cannot, until you show it the element. EditUI is that point-and-note pass in normal Chrome."
        ctaLocation="cursor-hero"
      />
      <div className="mx-auto max-w-3xl space-y-14 px-6 pb-20">
        <section className="space-y-4 text-[15px] leading-7">
          <p>
            Install the extension, click the live elements, write a short note on each one, and copy the whole review as one prompt. Paste it into Cursor, Claude Code, Codex, or whichever agent already has the repo. There is no MCP server and nothing to add to the project.
          </p>
          <p>
            Cursor Design Mode is a different product. It lives in Cursor's own browser and talks to Cursor's agent. EditUI does not try to be that loop. It is the same kind of pointing, done in the Chrome tab you are already using, then handed off by copy and paste.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight">Cursor Design Mode vs EditUI</h2>
          <p className="text-sm leading-6 text-muted">
            Design Mode is documented in{" "}
            <a className="text-accent underline decoration-accent/30 underline-offset-4" href="https://cursor.com/docs/agent/design-mode">
              Cursor's Design Mode guide
            </a>
            . The rows below are the practical split, not a scorecard.
          </p>
          <CompareTable columns={["Cursor Design Mode", "EditUI"]} rows={rows} />
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl tracking-tight">When Cursor Design Mode wins</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              <li>You are already in Cursor, and the page is open in the Agents Window browser.</li>
              <li>You want the agent to see the React component and a screenshot, not only the DOM.</li>
              <li>You want to draw on a region, or describe the change by voice.</li>
              <li>You want to send the next edit while an earlier agent run is still going.</li>
              <li>You do not want a copy-paste step between the click and the code change.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl tracking-tight">When EditUI wins</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              <li>The page is already open in normal Chrome, including a localhost tab you sized yourself.</li>
              <li>You want to finish the review before any agent starts.</li>
              <li>The agent is Claude Code, Codex, or something other than Cursor.</li>
              <li>You switch agents and do not want the review locked to one IDE.</li>
              <li>You do not want MCP, a signup, or a package added to the repo.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl tracking-tight">A Design Mode style pass in normal Chrome</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Same job: point at the running UI and say what should change. The handoff is a prompt you paste, not a run inside Cursor.
          </p>
          <div className="mt-6">
            <Steps steps={steps} showShorthand={false} />
          </div>
        </section>

        <section className="space-y-4 text-[15px] leading-7">
          <h2 className="text-2xl tracking-tight">What the prompt contains, and what it does not</h2>
          <p>
            Each note names the page, the viewport, your sentence, and the element you clicked: tag, visible text, nearby markup, and a few computed styles such as font size, padding, and flex alignment. Hashed class names are left out. You do not copy a selector by hand.
          </p>
          <p>
            EditUI does not read the React fiber tree, so it will not tell the agent which source file rendered the node. It does not attach a screenshot. If the change depends on a picture of the whole page, take that screenshot yourself and add it in the agent chat. Cursor Design Mode includes both the source identity and a screenshot. That is a real reason to stay in Cursor when you are already there.
          </p>
          <p>
            The batch is the other half. Design Mode is built for sending edits as you notice them. EditUI is built for collecting them. Twelve small notes in one prompt keep the page coherent. Twelve separate agent runs make you supervise the review instead of finishing it. The{" "}
            <Link className="text-accent underline decoration-accent/30 underline-offset-4" href="/batch-ui-edits">
              batch guide
            </Link>{" "}
            is the short version of that idea.
          </p>
        </section>

        <Faq items={faqs} schema title="FAQ" />

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight">Keep going</h2>
          <div>
            <ChromeCta location="cursor-footer" />
          </div>
          <RelatedPosts
            links={[
              { href: "/cursor-visual-editor", label: "Cursor Visual Editor, outside Cursor's browser" },
              { href: "/claude-code", label: "Use the same review with Claude Code" },
              { href: "/visual-ui-editor", label: "Visual UI editing for coding agents" },
              { href: "/batch-ui-edits", label: "Batch the notes before you send them" },
              { href: "/blog/cursor-design-mode-guide", label: "How Cursor Design Mode works" },
              { href: "/blog/mcp-pickers-vs-copy-paste", label: "MCP element pickers vs a copied batch" },
              { href: "/", label: "EditUI homepage" },
            ]}
          />
        </section>
      </div>
    </>
  );
}
