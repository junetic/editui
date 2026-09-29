export function CodeExample({ code, label = "Copied prompt" }: { code: string; label?: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-[#16181e] text-[#f4f5f7]">
      <figcaption className="border-b border-white/10 px-4 py-2 text-xs text-white/60">{label}</figcaption>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
