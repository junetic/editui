import Link from "next/link";
import { site } from "@/data/site";

const product = [
  { href: "/chrome-extension", label: "Chrome extension" },
  { href: "/claude-code", label: "Claude Code" },
  { href: "/cursor", label: "Cursor" },
  { href: "/codex", label: "Codex" },
];

const guides = [
  { href: "/cursor-visual-editor", label: "Cursor Visual Editor" },
  { href: "/visual-ui-editor", label: "Visual UI editor" },
  { href: "/batch-ui-edits", label: "Batch UI edits" },
  { href: "/blog", label: "Blog" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-12 pt-8">
      <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-medium">EditUI</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            Point at your UI. Tell your coding agent what to change.
          </p>
          <p className="mt-4 text-sm text-muted">
            Free · No account ·{" "}
            <a href={site.usercallUrl} className="underline decoration-line underline-offset-4 hover:text-ink">
              Made by Usercall
            </a>
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href={site.chromeStoreUrl} className="hover:text-ink" rel="noreferrer">
                Add to Chrome
              </a>
            </li>
            {product.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Guides</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {guides.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
