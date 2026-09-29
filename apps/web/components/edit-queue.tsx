export interface QueueItem {
  n: string;
  text: string;
}

export function EditQueue({ items, action }: { items: QueueItem[]; action?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card shadow-[0_16px_40px_rgba(20,22,28,0.06)]">
      <div className="border-b border-line px-4 py-3 text-sm font-medium">Review</div>
      <ol className="px-4">
        {items.map((item) => (
          <li key={item.n} className="flex gap-3 border-b border-line/80 py-3 last:border-b-0">
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-white">
              {item.n}
            </span>
            <span className="text-sm leading-6">{item.text}</span>
          </li>
        ))}
      </ol>
      {action ? <p className="border-t border-line px-4 py-3 text-sm font-medium">{action}</p> : null}
    </div>
  );
}
