import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMeta } from "@/lib/metadata";

export const metadata: Metadata = pageMeta({
  title: "EditUI privacy policy",
  description: "EditUI processes page context on your device. Notes leave the browser only when you copy a prompt and paste it yourself.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { label: "Privacy" },
        ]}
      />
      <h1 className="mt-8 text-4xl tracking-tight">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted">Last updated September 29, 2026</p>
      <div className="mdx mt-8 max-w-2xl text-[15px]">
        <p>
          EditUI is a Chrome extension that lets you point at elements on a page, write edit notes, and copy those notes as a prompt. It does not operate an EditUI server, account system, or analytics service inside the extension.
        </p>
        <h2>What stays on your device</h2>
        <p>When you turn on Edit Mode and select an element, EditUI reads that element from the page already open in your browser:</p>
        <ul>
          <li>page URL, path, and title</li>
          <li>viewport size</li>
          <li>the element’s tag, visible text, classes, a short attribute list, a compact HTML snippet, nearby parent and sibling markup, a small set of computed styles, and its bounding box</li>
        </ul>
        <p>Those notes are saved in chrome.storage.local on your device so they can be restored after a refresh. EditUI does not send them to the developer.</p>
        <h2>When information leaves your browser</h2>
        <p>
          Page content leaves the browser only if you press Copy all and then paste the prompt into a tool you choose, such as a coding agent. That paste is your action, in that tool, under that tool’s own terms.
        </p>
        <h2>What EditUI does not do</h2>
        <ul>
          <li>It does not sell or share data.</li>
          <li>It does not run remote code.</li>
          <li>It does not read a page until you turn Edit Mode on. The content script is present so the shortcut and toolbar button can start a review, and it stays inactive until then.</li>
        </ul>
        <h2>This website</h2>
        <p>
          The marketing site is static. If the deployment has Vercel Web Analytics enabled, that service receives standard page-view data for editui.app. The extension does not use it. Chrome install clicks on the site can be counted as an analytics event. The extension still does not transmit page content.
        </p>
        <h2>Removing data</h2>
        <p>Delete an edit in the review tray, or uninstall the extension. Uninstalling removes the notes stored by the extension.</p>
        <h2>Contact</h2>
        <p>Use the developer email on the Chrome Web Store listing.</p>
      </div>
    </article>
  );
}
