import type { Metadata } from "next";
import Link from "next/link";
import { agents } from "@/data/agents";
import { batchEdits } from "@/data/demos";
import { ChromeCta } from "@/components/chrome-cta";
import { Demo } from "@/components/demo";
import { EditQueue } from "@/components/edit-queue";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { Steps } from "@/components/steps";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "EditUI — Point at your UI. Tell your coding agent what to change.",
  description: site.description,
  path: "/",
});

const contextItems = ["element", "text", "DOM", "classes", "parent", "nearby elements", "URL", "viewport", "computed styles"];

export default function HomePage() {
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EditUI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Chrome",
    url: site.url,
    installUrl: site.chromeStoreUrl,
    description: site.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <JsonLd data={software} />
      <Hero />
      <Demo />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl tracking-tight">How it works</h2>
        <div className="mt-8">
          <Steps />
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <h2 className="text-3xl tracking-tight">Stop explaining which element you mean.</h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            EditUI captures the context your coding agent needs to understand what you are pointing at.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted">
            No screenshots to annotate. No selectors to copy. No source files to hunt down.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {contextItems.map((item) => (
            <li key={item} className="rounded-xl border border-line bg-card px-3 py-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 lg:grid-cols-[1fr_320px] lg:items-center">
        <div>
          <h2 className="text-3xl tracking-tight">Fix the whole page in one pass.</h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
            UI review does not happen one issue at a time. Collect everything you notice, then let your coding agent
            handle the batch.
          </p>
          <p className="mt-6">
            <Link href="/batch-ui-edits" className="text-sm text-accent underline decoration-accent/30 underline-offset-4">
              Batch UI edits
            </Link>
          </p>
        </div>
        <EditQueue items={batchEdits} action="Send 5 edits →" />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-xl tracking-tight">Works with the agent you already use.</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {agents.map((agent) => (
            <li key={agent.slug}>
              {agent.href ? (
                <Link href={agent.href} className="inline-flex rounded-full border border-line bg-card px-3 py-1.5 text-sm hover:border-ink">
                  {agent.name}
                </Link>
              ) : (
                <span className="inline-flex rounded-full border border-line bg-card px-3 py-1.5 text-sm">{agent.name}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/cursor" className="text-accent underline decoration-accent/30 underline-offset-4">
            Cursor Design Mode in Chrome
          </Link>
          <Link href="/cursor-visual-editor" className="text-accent underline decoration-accent/30 underline-offset-4">
            Cursor Visual Editor
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl tracking-tight">Your coding agent can fix it.</h2>
        <p className="mt-3 text-lg text-muted">Just show it what you mean.</p>
        <div className="mt-8">
          <ChromeCta location="home-final" />
        </div>
      </section>
    </>
  );
}
