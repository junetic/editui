export function Comparison({ columns }: { columns: { title: string; points: string[] }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {columns.map((column) => (
        <section key={column.title} className="rounded-2xl border border-line bg-card p-5">
          <h3 className="text-base font-medium">{column.title}</h3>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
            {column.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-2">
      {steps.map((step, index) => (
        <li key={step}>
          <p className="text-sm">{step}</p>
          {index < steps.length - 1 ? (
            <p className="py-1 text-xs text-muted" aria-hidden="true">
              ↓
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
