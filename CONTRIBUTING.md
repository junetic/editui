# Contributing

Issues and pull requests are welcome.

## Setup

```bash
pnpm install
pnpm dev
```

Load `output/chrome-mv3` as an unpacked extension. The README covers the marketing site and the other scripts.

## Checks

```bash
pnpm test
pnpm typecheck
pnpm build
```

`pnpm test:e2e` needs a display. It opens a headed Chromium window with the built extension.

## Before you open a pull request

- Keep the change focused on the extension, the site, or the docs you are fixing.
- Do not commit `.env` files, credentials, Chrome Web Store upload keys, or private customer data.
- Keep the extension local-first: notes stay on the device until the user copies a prompt. Do not add an account, a remote prompt upload, or an MCP requirement for the basic workflow.
