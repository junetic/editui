import Link from "next/link";
import { ChromeCta } from "@/components/chrome-cta";
import { CompareTable } from "@/components/compare-table";
import { PageIntro } from "@/components/page-intro";
import { RelatedPosts } from "@/components/related-posts";
import { pageMeta } from "@/lib/metadata";

export const metadata = pageMeta({
  title: "Cursor Visual Editor, in Normal Chrome | EditUI",
  description:
    "What Cursor's Visual Editor does inside the Cursor Browser, and how to point at the same running UI in Chrome when the agent is not Cursor.",
  path: "/cursor-visual-editor",
});

const rows = [
  {
    label: "Where it runs",
    cells: ["The Cursor Browser, in the same window as the code.", "Normal Chrome, including localhost."],
  },
  {
    label: "How you edit",
    cells: [
      "Drag layout, inspect props, tweak styles, and describe changes on a click.",
      "Click an element and write the change. No drag handles and no style sidebar.",
    ],
  },
  {
    label: "Who edits the code",
    cells: ["Cursor's agent, after you ask it to apply the visual result.", "Any agent you paste the prompt into."],
  },
  {
    label: "Setup",
    cells: ["Open the app in Cursor's browser.", "Install the extension. Nothing goes in the repo."],
  },
];

export default function CursorVisualEditorPage() {
  return (
    <>
      <PageIntro
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/cursor", label: "Cursor Design Mode" },
          { label: "Visual Editor" },
        ]}
        eyebrow="Cursor Visual Editor"
        title="Cursor's Visual Editor, when you are not in Cursor's browser"
        lede="Cursor's Visual Editor is a strong way to manipulate a running page inside Cursor. EditUI is the point-and-note version of that job in normal Chrome, for any coding agent."
        ctaLocation="cursor-visual-editor-hero"
      />
      <div className="mx-auto max-w-3xl space-y-12 px-6 pb-20 text-[15px] leading-7">
        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight">What Cursor's Visual Editor is</h2>
          <p>
            Cursor announced it as{" "}
            <a
              className="text-accent underline decoration-accent/30 underline-offset-4"
              href="https://cursor.com/blog/browser-visual-editor"
            >
              a visual editor for the Cursor Browser
            </a>
            . The app, the codebase, and the editing controls sit in one window. You can drag rendered elements around the DOM, inspect component props in a sidebar, and adjust layout, color, and type with the controls there. You can also click something and describe the change in words: make this bigger, turn this red, swap their order. Cursor says those agent runs can proceed in parallel, and then the agent updates the underlying code.
          </p>
          <p>
            That is more than a comment layer. The Visual Editor lets you try the layout with your hands, then ask Cursor's agent to make the code match.{" "}
            <Link className="text-accent underline decoration-accent/30 underline-offset-4" href="/cursor">
              Design Mode
            </Link>{" "}
            is the neighboring feature: point, draw, or talk in the Agents Window browser, and Cursor's agent edits from that prompt. People search for both. They are related, and they are not the same control.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight">The gap</h2>
          <p>
            Both tools run in Cursor's browser. The agent that receives the click is Cursor's agent. If the page you care about is a normal Chrome tab, or the agent you trust today is Claude Code or Codex, you are outside that window.
          </p>
          <p>
            The usual workaround is a sentence: "the card on the right, under the price, the one that feels too heavy." The agent guesses. You correct it. The bug was obvious on screen the whole time.
          </p>
        </section>

        <CompareTable columns={["Cursor Visual Editor", "EditUI"]} rows={rows} />

        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight">A pass outside Cursor's browser</h2>
          <p>
            Run the app. Open the same URL in Chrome, localhost included, at the width you are judging. Turn on EditUI with the toolbar icon or Command-Shift-E. Click the element that looks wrong and write the outcome: make this quieter, even these out, stack this on a narrow window. Leave the style sidebar work to Cursor. Your sentence plus the click is the whole instruction.
          </p>
          <p>
            Do not send each note as its own prompt. The Visual Editor can fire several agent runs while you keep clicking. EditUI waits until the review is finished, then Copy all produces one prompt. Paste it into Cursor if that is the agent you want, or into Claude Code or Codex if it is not. When the page reloads, check the same elements. The notes that missed get a shorter follow-up. The ones that landed stay done.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl tracking-tight">The EditUI path</h2>
          <p>
            Open the same localhost URL, or any other page, in Chrome. Turn on EditUI. Click the element and write the outcome, not a tour of the stylesheet. Keep going until the pass is done. Copy all. Paste the prompt into the agent that has the repository.
          </p>
          <p>
            The prompt carries the URL, the viewport, each note, and DOM context for the elements you clicked: tag, text, nearby markup, and a short list of computed styles. It does not drag elements, expose React props, or attach a screenshot. You are not visually rearranging the page inside the browser. You are naming what should change, in a batch, and letting the agent edit the code.
          </p>
          <p>
            There is no MCP server. Nothing is added to the project. The same clipboard works if you switch agents tomorrow. A longer version of the batch idea is on the{" "}
            <Link className="text-accent underline decoration-accent/30 underline-offset-4" href="/batch-ui-edits">
              batch UI edits
            </Link>{" "}
            page.
          </p>
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xl tracking-tight">Stay in Cursor's Visual Editor when</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              <li>You want to drag the layout and see it before any code changes.</li>
              <li>You want props and style controls next to the running page.</li>
              <li>Cursor is the agent that will write the code, and the page is already in its browser.</li>
              <li>You want several of those prompts running without a paste step.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl tracking-tight">Use EditUI when</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
              <li>The review is happening in normal Chrome.</li>
              <li>You want one batch of notes, then one paste.</li>
              <li>The agent is Claude Code, Codex, or another tool.</li>
              <li>You do not want the review tied to Cursor's browser.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <p>
            EditUI will not replace the Visual Editor's direct manipulation. If the job is "nudge this until it looks right, then apply," stay in Cursor. If the job is "I can see six things that are wrong, and I need the agent to know which elements I mean," point at them in Chrome and paste the list.
          </p>
          <ChromeCta location="cursor-visual-editor-footer" />
          <RelatedPosts
            links={[
              { href: "/cursor", label: "Cursor Design Mode in Chrome" },
              { href: "/claude-code", label: "Hand the same review to Claude Code" },
              { href: "/visual-ui-editor", label: "Visual UI editing for coding agents" },
              { href: "/blog/cursor-design-mode-guide", label: "How Design Mode works" },
              { href: "/", label: "EditUI homepage" },
            ]}
          />
        </section>
      </div>
    </>
  );
}
