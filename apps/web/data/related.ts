export interface RelatedLink {
  href: string;
  label: string;
}

export const relatedBySlug: Record<string, RelatedLink[]> = {
  "visual-edit-ui-claude-code": [
    { href: "/claude-code", label: "A visual UI layer for Claude Code" },
    { href: "/cursor", label: "Cursor Design Mode in Chrome" },
    { href: "/blog/mcp-pickers-vs-copy-paste", label: "MCP element pickers vs a copied batch" },
    { href: "/blog/click-element-send-claude-code", label: "Click an element and send it to Claude Code" },
  ],
  "click-element-send-claude-code": [
    { href: "/claude-code", label: "Claude Code visual editing" },
    { href: "/cursor", label: "The same pointing workflow next to Cursor Design Mode" },
    { href: "/blog/mcp-pickers-vs-copy-paste", label: "MCP element pickers vs a copied batch" },
    { href: "/chrome-extension", label: "Install the Chrome extension" },
  ],
  "cursor-design-mode-guide": [
    { href: "/cursor", label: "Cursor Design Mode in Chrome" },
    { href: "/cursor-visual-editor", label: "Cursor Visual Editor comparison" },
    { href: "/chrome-extension", label: "EditUI Chrome extension" },
  ],
  "mcp-pickers-vs-copy-paste": [
    { href: "/cursor", label: "Cursor Design Mode in Chrome" },
    { href: "/claude-code", label: "Paste the batch into Claude Code" },
    { href: "/batch-ui-edits", label: "Batch UI edits" },
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
