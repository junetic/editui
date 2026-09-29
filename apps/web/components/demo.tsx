"use client";

import { useEffect, useState } from "react";
import { homepageDemo } from "@/data/demos";

type Phase = "hero" | "cards" | "cta" | "review" | "result";

const phases: Phase[] = ["hero", "cards", "cta", "review", "result"];

const captions: Record<Phase, string> = {
  hero: "① Clicks the heading. Make this heading slightly smaller.",
  cards: "② Clicks the card group. Make these equal height.",
  cta: "③ Clicks the CTA. This feels too prominent. Make it secondary.",
  review: "3 edits · Review → Copy for Claude Code",
  result: "The agent changes the code. The browser updates.",
};

const cursorAt: Record<Phase, { top: string; left: string }> = {
  hero: { top: "22%", left: "34%" },
  cards: { top: "58%", left: "48%" },
  cta: { top: "84%", left: "28%" },
  review: { top: "72%", left: "82%" },
  result: { top: "24%", left: "36%" },
};

export function Demo() {
  const [phase, setPhase] = useState<Phase>("hero");
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setTimeout(() => {
      const index = phases.indexOf(phase);
      setPhase(phases[(index + 1) % phases.length] ?? "hero");
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [phase, paused, reduced]);

  const visible = new Set(homepageDemo.edits.filter((edit) => phaseRank(edit.id) <= phaseRank(phase)).map((edit) => edit.id));
  const applied = phase === "result";
  const copied = phase === "review" || phase === "result";
  const activeNote = homepageDemo.edits.find((edit) => edit.id === phase);

  function pick(next: Phase) {
    setPaused(true);
    setPhase(next);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-8" aria-labelledby="demo-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 id="demo-title" className="text-sm font-medium text-muted">
          Demo
        </h2>
        <button type="button" className="text-sm text-muted underline decoration-line underline-offset-4" onClick={() => setPaused((value) => !value)}>
          {paused || reduced ? "Play" : "Pause"}
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_20px_50px_rgba(20,22,28,0.06)]">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <p className="ml-3 text-xs text-muted">{homepageDemo.url}</p>
        </div>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="relative min-h-[440px] border-b border-line p-8 sm:p-10 lg:border-b-0 lg:border-r">
            <button
              type="button"
              data-demo="hero"
              onClick={() => pick("hero")}
              className={`relative block w-fit max-w-xl rounded-xl text-left transition-all duration-500 ${visible.has("hero") ? "ring-2 ring-accent ring-offset-4 ring-offset-card" : ""}`}
            >
              {visible.has("hero") ? <Marker n="1" /> : null}
              <span className={`block font-medium tracking-tight transition-all duration-500 ${applied ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
                {homepageDemo.heading}
              </span>
            </button>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted">{homepageDemo.lede}</p>
            <div className={`mt-8 grid gap-3 sm:grid-cols-3 ${applied ? "items-stretch" : "items-start"}`}>
              {homepageDemo.cards.map((card, index) => (
                <button
                  key={card.title}
                  type="button"
                  data-demo="cards"
                  onClick={() => pick("cards")}
                  className={`relative rounded-xl border border-line p-4 text-left transition-all duration-500 ${applied ? "h-full min-h-36" : index === 1 ? "min-h-52" : "min-h-24"} ${visible.has("cards") ? "ring-2 ring-accent" : ""}`}
                >
                  {index === 0 && visible.has("cards") ? <Marker n="2" /> : null}
                  <span className="block text-sm font-medium">{card.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted">{card.body}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              data-demo="cta"
              onClick={() => pick("cta")}
              className={`relative mt-8 rounded-full px-4 py-2.5 text-sm transition-all duration-500 ${applied ? "border border-line bg-transparent text-ink" : "bg-accent text-white"} ${visible.has("cta") ? "ring-2 ring-ink ring-offset-4 ring-offset-card" : ""}`}
            >
              {visible.has("cta") ? <Marker n="3" /> : null}
              {homepageDemo.cta}
            </button>
            {activeNote ? (
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 max-w-sm rounded-xl border border-line bg-white p-3 text-sm shadow-lg sm:left-8">
                <p>{activeNote.text}</p>
                <p className="mt-2 text-xs font-medium text-muted">Add edit</p>
              </div>
            ) : null}
            <span
              aria-hidden
              className="pointer-events-none absolute z-10 hidden text-ink transition-all duration-700 lg:block"
              style={cursorAt[phase]}
            >
              <svg width="18" height="18" viewBox="0 0 12 12">
                <path d="M1.2 0.8 10.6 6 6.2 7.2 4.7 11.2Z" fill="currentColor" />
              </svg>
            </span>
          </div>
          <aside className="flex flex-col bg-[#fffcf8]">
            <div className="border-b border-line px-4 py-3 text-sm font-medium">
              {visible.size || "0"} {visible.size === 1 ? "edit" : "edits"}
            </div>
            <ol className="flex-1 px-4">
              {homepageDemo.edits.map((edit) =>
                visible.has(edit.id) ? (
                  <li key={edit.id} className="flex gap-3 border-b border-line py-3 text-sm">
                    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] text-white">
                      {edit.n}
                    </span>
                    <span>{edit.text}</span>
                  </li>
                ) : null,
              )}
            </ol>
            <div className="border-t border-line p-3">
              <button
                type="button"
                data-demo="review"
                onClick={() => pick(phase === "review" ? "result" : "review")}
                className={`w-full rounded-lg px-3 py-2 text-sm text-white ${copied ? "bg-accent" : "bg-ink"}`}
              >
                {copied ? "Copied" : "Copy all"}
              </button>
            </div>
          </aside>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {captions[phase]}
      </p>
    </section>
  );
}

function phaseRank(phase: string): number {
  return phases.indexOf(phase as Phase);
}

function Marker({ n }: { n: string }) {
  return (
            <span className="marker-pop absolute -left-2.5 -top-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-white">
      {n}
    </span>
  );
}
