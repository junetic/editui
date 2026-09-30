export function Shot({ caption }: { caption: string }) {
  return (
    <figure className="my-8">
      <div className="flex min-h-36 items-end rounded-2xl border border-dashed border-line bg-card px-4 py-3 text-sm text-muted">
        Screenshot
      </div>
      <figcaption className="mt-2 text-sm leading-6 text-muted">{caption}</figcaption>
    </figure>
  );
}
