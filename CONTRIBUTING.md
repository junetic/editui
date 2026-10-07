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
pnpm build:firefox
```

`pnpm test:e2e` needs a display. It opens a headed Chromium window with the built extension.

### Firefox manual check

Run `pnpm build:firefox` and load `output/firefox-mv3/manifest.json` as a temporary add-on via `about:debugging#/runtime/this-firefox`. Alternatively, `pnpm dev:firefox` launches a separate development profile. Both Firefox commands explicitly target Manifest V3 because the shared background code uses `browser.action`.

Test on a normal web page (not a browser-internal or otherwise restricted page), granting site access if prompted:

- Toggle Edit Mode with the toolbar icon, then verify the keyboard shortcut toggles it once per press.
- Click an element, write a note, and add it to the batch.
- Add another note, open Review, and check both notes and their element context.
- Click **Copy all**, paste into a text editor, and verify the notes and page context are present. Check this on both HTTP/localhost and HTTPS pages.
- Reload the page and verify the saved notes are restored when you reopen Edit Mode.
- Turn Edit Mode off and verify normal page interaction resumes.

Record the Firefox version and results in the pull request. The existing Chromium E2E tests do not validate Firefox extension loading or clipboard behavior. No Firefox store listing or signing setup is needed for these local tests.

## Before you open a pull request

- Keep the change focused on the extension, the site, or the docs you are fixing.
- Do not commit `.env` files, credentials, Chrome Web Store upload keys, or private customer data.
- Keep the extension local-first: notes stay on the device until the user copies a prompt. Do not add an account, a remote prompt upload, or an MCP requirement for the basic workflow.
