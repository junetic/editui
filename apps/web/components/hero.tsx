import { ChromeCta } from "@/components/chrome-cta";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-8 pt-14 sm:pt-20">
      <p className="text-sm font-medium text-accent">EditUI</p>
      <h1 className="mt-4 text-4xl leading-[1.05] tracking-tight sm:text-6xl">
        Point at your UI.
        <span className="mt-2 block">Tell your coding agent what to change.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
        Review your running app in Chrome. Click any element, leave an edit, collect as many as you want, then send
        them all to Claude Code, Cursor or your coding agent.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <ChromeCta location="home-hero" />
        <p className="text-sm text-muted">Free · No repo setup</p>
      </div>
    </section>
  );
}
