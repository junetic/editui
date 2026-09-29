# EditUI privacy policy

Last updated: September 29, 2026

EditUI is a Chrome extension that lets you point at elements on a page, write edit notes, and copy those notes as a prompt. It does not operate an EditUI server, account system, or analytics service.

## What stays on your device

When you turn on Edit Mode and select an element, EditUI reads that element from the page already open in your browser:

- page URL, path, and title
- viewport size
- the element’s tag, visible text, classes, a short attribute list, a compact HTML snippet, nearby parent and sibling markup, a small set of computed styles, and its bounding box

Those notes are saved in `chrome.storage.local` on your device so they can be restored after a refresh. EditUI does not send them to the developer.

## When information leaves your browser

Page content leaves the browser only if you press **Copy all** and then paste the prompt into a tool you choose, such as a coding agent. That paste is your action, in that tool, under that tool’s own terms.

## What EditUI does not do

- It does not sell or share data.
- It does not run remote code.
- It does not read a page until you turn Edit Mode on. The content script is present so the shortcut and toolbar button can start a review, and it stays inactive until then.

## Removing data

Delete an edit in the review tray, or uninstall the extension. Uninstalling removes the notes stored by the extension.

## Contact

Use the developer email on the Chrome Web Store listing.
