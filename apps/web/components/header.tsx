import Link from "next/link";
import { nav } from "@/data/site";
import { ChromeCta } from "@/components/chrome-cta";
import { GitHubLink } from "@/components/github-link";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-5">
      <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
        <img src="/logo.png" alt="" width={28} height={28} className="h-7 w-7" />
        EditUI
      </Link>
      <nav className="hidden items-center gap-5 text-sm text-muted sm:flex" aria-label="Primary">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-ink">
            {item.label}
          </Link>
        ))}
        <GitHubLink />
        <ChromeCta location="header" size="sm" />
      </nav>
      <div className="flex items-center gap-4 sm:hidden">
        <GitHubLink />
        <details className="relative">
          <summary className="cursor-pointer list-none text-sm text-muted">Menu</summary>
          <nav className="absolute right-0 z-10 mt-2 w-44 rounded-xl border border-line bg-card p-3 shadow-sm" aria-label="Primary">
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block py-1">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <ChromeCta location="header-mobile" size="sm" />
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
