export interface RelatedLink {
  href: string;
  label: string;
}

export const relatedBySlug: Record<string, RelatedLink[]> = {
  "visual-edit-ui-claude-code": [
    { href: "/claude-code", label: "A visual UI layer for Claude Code" },
    { href: "/chrome-extension", label: "EditUI Chrome extension" },
    { href: "/blog/click-element-send-claude-code", label: "Click an element and send it to Claude Code" },
  ],
  "click-element-send-claude-code": [
    { href: "/claude-code", label: "Claude Code visual editing" },
    { href: "/chrome-extension", label: "Install the Chrome extension" },
    { href: "/blog/visual-context-coding-agents", label: "Give coding agents better visual context" },
  ],
  "cursor-design-mode-guide": [
    { href: "/cursor", label: "Cursor-style visual prompting in Chrome" },
    { href: "/chrome-extension", label: "EditUI Chrome extension" },
    { href: "/blog/batch-ui-changes-ai", label: "Batch UI changes with a coding agent" },
  ],
  "batch-ui-changes-ai": [
    { href: "/batch-ui-edits", label: "Batch UI edits" },
    { href: "/visual-ui-editor", label: "Visual UI editing for coding agents" },
    { href: "/chrome-extension", label: "EditUI Chrome extension" },
  ],
  "polish-ai-generated-ui": [
    { href: "/visual-ui-editor", label: "Visual UI editing for coding agents" },
    { href: "/batch-ui-edits", label: "Batch the polish pass" },
    { href: "/chrome-extension", label: "EditUI Chrome extension" },
  ],
  "visual-context-coding-agents": [
    { href: "/visual-ui-editor", label: "Visual UI editing" },
    { href: "/claude-code", label: "Use it with Claude Code" },
    { href: "/blog/click-element-send-claude-code", label: "Click an element and send it" },
  ],
};
