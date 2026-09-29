# Chrome Web Store listing

Publish the zip from `pnpm zip` (`output/editui-1.0.0-chrome.zip`). Host `store/privacy-policy.md` at a public URL and paste that URL into the privacy-policy field. The store upload itself uses your developer account.

## Dashboard fields

- Name: EditUI
- Category: Developer Tools
- Language: English
- Single purpose: Point at a page, collect visual edit notes, and copy them as one prompt for a coding agent.

### Short description

Point at your UI, collect visual edits, and copy one prompt for Claude Code, Cursor, or any coding agent.

### Detailed description

EditUI is visual prompting for coding agents.

Point at your UI. Tell your coding agent what to change.

Review a running product, click the elements you want changed, and write a short note on each one. Collect the batch, then copy a single prompt with the page, the element, and enough DOM context for Claude Code, Cursor, Codex, or any other coding agent to make the change.

See it. Point at it. Prompt it. Ship it.

EditUI does not edit source code and does not replace your coding agent. Notes stay on your device until you copy them.

### Permission justification

- storage: Saves edit notes in chrome.storage.local on the device so a refresh does not wipe the review.
- Content script on all URLs: The extension has to see the page being reviewed. It does nothing until Edit Mode is turned on with the toolbar button or Command-Shift-E. It does not transmit page content.

### Data disclosure

Answer that the extension does not collect or transmit user data to the developer. Page content is processed locally. It reaches another product only when the user copies the prompt and pastes it there.

### Icons

Use `public/icon/128.png` for the store icon. Take at least one 1280×800 screenshot of Edit Mode on a localhost page after the manual pass below.

## Manual pass before upload

1. `pnpm dev`
2. Load `output/chrome-mv3` as an unpacked extension.
3. On a localhost app, add 5 edits, open Review, and press Copy all.
4. Paste into a coding agent and confirm it can name the elements you selected.
