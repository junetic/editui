import { ChromeCta } from "@/components/chrome-cta";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";

export function PageIntro({
  crumbs,
  eyebrow,
  title,
  lede,
  ctaLocation,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lede: string;
  ctaLocation: string;
}) {
  return (
    <header className="mx-auto max-w-3xl px-6 pb-10 pt-10">
      <Breadcrumbs items={crumbs} />
      {eyebrow ? <p className="mt-8 text-sm font-medium text-accent">{eyebrow}</p> : null}
      <h1 className="mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-muted">{lede}</p>
      <div className="mt-8">
        <ChromeCta location={ctaLocation} />
      </div>
    </header>
  );
}
