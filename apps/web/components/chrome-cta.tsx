"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { site } from "@/data/site";

interface ChromeCtaProps {
  location: string;
  label?: string;
  size?: "md" | "sm";
}

export function ChromeCta({ location, label = "Add to Chrome", size = "md" }: ChromeCtaProps) {
  const className =
    size === "sm"
      ? "inline-flex items-center justify-center rounded-full bg-ink px-3.5 py-1.5 text-sm text-white hover:bg-black"
      : "inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-[15px] text-white hover:bg-black";

  function onClick() {
    track("chrome_install_click", { location });
  }

  if (site.chromeStoreUrl) {
    return (
      <a className={className} href={site.chromeStoreUrl} onClick={onClick} data-cta="chrome" rel="noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link className={className} href="/chrome-extension#install" onClick={onClick} data-cta="chrome">
      {label}
    </Link>
  );
}
