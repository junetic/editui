# EditUI

Chrome extension for pointing at a running UI, collecting edit notes, and copying one prompt for a coding agent.

```bash
pnpm install
pnpm dev
```

Load `.output/chrome-mv3` from `chrome://extensions` as an unpacked extension. Click the toolbar icon, or press Command-Shift-E, to enter Edit Mode.

```bash
pnpm test
pnpm test:e2e
pnpm zip
```

The store listing and privacy policy are in `store/`. Upload still needs a Chrome Web Store developer account. Once the site is deployed, use `/privacy` as the public privacy-policy URL.

The marketing site lives in `apps/web`.

```bash
pnpm dev:web
pnpm build:web
```

Set the Vercel project root to `apps/web`. Optional environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CHROME_STORE_URL`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
