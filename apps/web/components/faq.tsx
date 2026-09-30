import { JsonLd } from "@/components/json-ld";

export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items, schema = false, title = "Questions" }: { items: FaqItem[]; schema?: boolean; title?: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section>
      {schema ? <JsonLd data={data} /> : null}
      <h2 className="text-2xl tracking-tight">{title}</h2>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <div key={item.q} className="py-5">
            <dt className="font-medium">{item.q}</dt>
            <dd className="mt-2 text-sm leading-6 text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
