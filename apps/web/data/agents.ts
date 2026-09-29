export interface Agent {
  slug: string;
  name: string;
  href: string | null;
}

export const agents: Agent[] = [
  { slug: "claude-code", name: "Claude Code", href: "/claude-code" },
  { slug: "cursor", name: "Cursor", href: "/cursor" },
  { slug: "codex", name: "Codex", href: "/codex" },
  { slug: "windsurf", name: "Windsurf", href: null },
  { slug: "clipboard", name: "Copy anywhere", href: "/chrome-extension" },
];
