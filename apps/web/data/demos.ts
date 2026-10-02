export interface DemoEdit {
  id: "hero" | "cards" | "cta";
  n: string;
  text: string;
}

export const homepageDemo = {
  url: "usercall.co",
  heading: "Customer interviews, without the calendar chase",
  lede: "A running app, reviewed in Chrome. Click a part of the page and leave the change you want.",
  cards: [
    { title: "Schedule", body: "Send a link. They pick a time that already fits." },
    { title: "Capture", body: "The call, the quotes, and the follow-ups stay in one note." },
    { title: "Share", body: "Hand the team a note they can actually read." },
  ],
  cta: "Book a research call",
  edits: [
    { id: "hero", n: "1", text: "Make this heading slightly smaller." },
    { id: "cards", n: "2", text: "Make these equal height." },
    { id: "cta", n: "3", text: "This feels too prominent. Make it secondary." },
  ] satisfies DemoEdit[],
};

export const batchEdits = [
  { n: "1", text: "Reduce hero height" },
  { n: "2", text: "Align these cards" },
  { n: "3", text: "Make this CTA secondary" },
  { n: "4", text: "Tighten this spacing" },
  { n: "5", text: "Stack these on mobile" },
];

export const pageBatch = [
  { n: "1", text: "Hero — shorten the headline and drop the extra line." },
  { n: "2", text: "Navigation — the current page should be obvious." },
  { n: "3", text: "Pricing card — these three should be the same height." },
  { n: "4", text: "CTA — this button is competing with the headline." },
  { n: "5", text: "Footer — the links are too far apart." },
];

export const samplePrompt = `I reviewed the UI at:

\`https://usercall.co/\`

Viewport: 1440×900

Please implement the following 3 UI changes while preserving the existing design system and responsive behavior.

## Edit 1 — Customer interviews, without the calendar chase

**Request:**
Make this heading slightly smaller.

**Selected element:**
\`<h1 class="hero-title">\`

**Text:**
Customer interviews, without the calendar chase

**Bounds:**
96, 128, 640×112

**DOM context:**
<section class="hero">
<h1 class="hero-title">Customer interviews, without the calendar chase</h1>
after: <p>A running app, reviewed in Chrome.</p>
styles: display: block; font-size: 60px; font-weight: 500; line-height: 64px

## Edit 2 — Schedule Capture Share

**Request:**
Make these equal height.

## Edit 3 — Book a research call

**Request:**
This feels too prominent. Make it secondary.

Implement all requested changes, then review the resulting page against each edit.`;
