export const site = {
  name: "EditUI",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.editui.app",
  chromeStoreUrl:
    process.env.NEXT_PUBLIC_CHROME_STORE_URL ||
    "https://chromewebstore.google.com/detail/editui/kolehloegjbpkeehflbdkjkdmljobfak",
  usercallUrl: "https://usercall.co",
  githubUrl: "https://github.com/junetic/editui",
  description:
    "Point at your UI. Tell your coding agent what to change. Click elements in Chrome, collect the edits, and copy one prompt for Claude Code, Cursor, or any coding agent.",
};

export const nav = [
  { href: "/chrome-extension", label: "Extension" },
  { href: "/claude-code", label: "Claude Code" },
  { href: "/cursor", label: "Cursor" },
  { href: "/blog", label: "Blog" },
];

export const pages = [
  { path: "/", priority: 1 },
  { path: "/chrome-extension", priority: 0.9 },
  { path: "/claude-code", priority: 0.9 },
  { path: "/cursor", priority: 0.9 },
  { path: "/cursor-visual-editor", priority: 0.8 },
  { path: "/codex", priority: 0.7 },
  { path: "/visual-ui-editor", priority: 0.8 },
  { path: "/batch-ui-edits", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
];
