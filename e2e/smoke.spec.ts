import { expect, test, chromium, type BrowserContext } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const fixture = readFileSync(path.resolve('fixtures/review.html'));

async function serveFixture(): Promise<{ url: string; close: () => Promise<void> }> {
  const server: Server = createServer((request, response) => {
    if (request.url !== '/') {
      response.writeHead(404);
      response.end('missing');
      return;
    }
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(fixture);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('fixture server has no port');
  return {
    url: `http://127.0.0.1:${address.port}/`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

async function extensionStorage(context: BrowserContext): Promise<string> {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker', { timeout: 10_000 }));
  return worker.evaluate(async () => {
    const extension = globalThis as unknown as {
      chrome: { storage: { local: { get: (key: null) => Promise<Record<string, unknown>> } } };
    };
    const items = await extension.chrome.storage.local.get(null);
    return JSON.stringify(items);
  });
}
async function toggleEditing(context: BrowserContext): Promise<void> {
  const worker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker', { timeout: 10_000 }));
  await worker.evaluate(async () => {
    const extension = globalThis as unknown as {
      chrome: {
        tabs: {
          query: (query: { active: boolean; currentWindow: boolean }) => Promise<Array<{ id?: number }>>;
          sendMessage: (tabId: number, message: { type: 'toggle-edit-mode' }) => Promise<void>;
        };
      };
    };
    const [tab] = await extension.chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id == null) throw new Error('no active tab');
    await extension.chrome.tabs.sendMessage(tab.id, { type: 'toggle-edit-mode' });
  });
}

test('removes an edit from the tray', async () => {
  const extensionPath = path.resolve('.output/chrome-mv3');
  const fixtureServer = await serveFixture();
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });

  try {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(fixtureServer.url);
    await expect(async () => {
      if ((await page.locator('[data-editui="editing"]').count()) === 0) await toggleEditing(context);
      await expect(page.locator('[data-editui="editing"]')).toBeAttached();
    }).toPass({ timeout: 15_000 });

    await page.locator('#hero-heading').click();
    const prompt = page.locator('[data-editui="prompt-input"]');
    await prompt.fill('Make this heading slightly smaller');
    await prompt.press('Enter');
    await page.locator('[data-editui="more"]').click();
    await page.locator('[data-editui="delete"]').click();
    await expect(page.locator('[data-editui="delete"]')).toHaveCount(0);
    await expect.poll(() => extensionStorage(context), { timeout: 5_000 }).not.toContain('Make this heading slightly smaller');

    await page.locator('#hero-heading').click();
    await page.locator('[data-editui="prompt-input"]').fill('Remove this copied note');
    await page.locator('[data-editui="prompt-input"]').press('Enter');
    await page.locator('[data-editui="copy-all"]').click();
    await page.locator('[data-editui="copied-note"]').click();
    await page.locator('[data-editui="more"]').click();
    await expect(page.locator('[data-editui="delete-copied"]')).toBeVisible();
    await page.locator('[data-editui="delete-copied"]').click();
    await expect(page.locator('[data-editui="copied-note"]')).toHaveCount(0);
    await expect.poll(() => extensionStorage(context), { timeout: 5_000 }).not.toContain('Remove this copied note');
  } finally {
    await context.close();
    await fixtureServer.close();
  }
});

test('collects a batch and copies a prompt', async () => {
  const extensionPath = path.resolve('.output/chrome-mv3');
  const fixtureServer = await serveFixture();
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });

  try {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(fixtureServer.url);
    await expect(async () => {
      if ((await page.locator('[data-editui="editing"]').count()) === 0) await toggleEditing(context);
      await expect(page.locator('[data-editui="editing"]')).toBeAttached();
    }).toPass({ timeout: 15_000 });
    await expect(page.locator('[data-editui="exit"]')).toBeVisible();
    await expect
      .poll(() => page.locator('#hero-heading').evaluate((element) => getComputedStyle(element).cursor))
      .toContain('crosshair');

    await page.locator('#hero-heading').hover();
    await expect
      .poll(() => page.locator('.outline').first().evaluate((element) => getComputedStyle(element).backgroundColor))
      .toBe('rgba(0, 0, 0, 0)');

    await page.locator('#hero-heading').click();
    const prompt = page.locator('[data-editui="prompt-input"]');
    await prompt.fill('Make this heading slightly smaller');
    await prompt.press('Enter');
    await expect(page.locator('[data-editui="tray"] h2')).toHaveText('EditUI — 1 edit');
    await expect(page.locator('[data-editui="review"]')).toHaveCount(0);
    await expect(page).toHaveURL(fixtureServer.url);
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).marginRight)).toBe('0px');
    const tray = await page.locator('[data-editui="tray"]').boundingBox();
    const viewport = page.viewportSize();
    if (!tray || !viewport) throw new Error('tray is not visible');
    expect(tray.height).toBeLessThan(viewport.height - 24);
    expect(tray.x).toBeGreaterThan(12);
    expect(viewport.width - (tray.x + tray.width)).toBeGreaterThan(12);
    await expect(page.locator('[data-editui="tray-grip"]')).toBeVisible();
    await expect(page.locator('[data-editui="tray-resize"]')).toBeVisible();
    await page.locator('[data-editui="tray"] .tray-title').first().hover();
    await expect(page.locator('.marker.hot')).toBeVisible();

    await page.locator('[data-testid="card-one"]').click({ modifiers: ['Shift'] });
    await page.locator('[data-testid="card-two"]').click({ modifiers: ['Shift'] });
    await page.locator('[data-testid="card-one"]').click();
    const multi = page.locator('[data-editui="prompt-input"]');
    await expect(page.getByText('2 elements selected')).toBeVisible();
    await multi.fill('Make these equal height');
    await multi.press('Enter');

    await page.locator('[data-editui="marker"]').first().click({ force: true });
    await expect(page.locator('[data-editui="note-input"]')).toHaveValue('Make this heading slightly smaller');
    await expect
      .poll(() =>
        page.locator('.outline.selected').first().evaluate((element) => {
          const style = getComputedStyle(element);
          return `${style.backgroundColor} ${style.borderTopWidth}`;
        }),
      )
      .toBe('rgba(0, 0, 0, 0) 2.5px');

    await page.locator('[data-editui="copy-all"]').click();
    await expect(page.locator('[data-editui="copy-again"]')).toHaveText(/Copy again/);

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('Make this heading slightly smaller');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('Make these equal height');
    expect(copied).toContain('Pricing that scales with your research');
    expect(copied).toContain(fixtureServer.url);

    await expect(page.locator('[data-editui="tray"] h2')).toHaveText('EditUI — 2 edits');
    await expect(page.getByText('Make this heading slightly smaller')).toBeVisible();
    await page.locator('[data-editui="undo"]').click();
    await expect(page.locator('[data-editui="tray"] h2')).toHaveText('EditUI — 2 edits');

    await page.locator('[data-editui="copy-all"]').click();
    await expect(page.locator('[data-editui="tray"] h2')).toHaveText('EditUI — 2 edits');
    await expect.poll(() => extensionStorage(context)).toContain('Make this heading slightly smaller');

    await page.reload();
    await expect(async () => {
      if ((await page.locator('[data-editui="editing"]').count()) === 0) await toggleEditing(context);
      await expect(page.locator('[data-editui="editing"]')).toBeAttached();
    }).toPass({ timeout: 15_000 });
    await expect(page.locator('[data-editui="tray"] h2')).toHaveText('EditUI — 2 edits');
    await expect(page.locator('[data-editui="review"]')).toHaveCount(0);
    await page.locator('[data-editui="copy-again"]').click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('Make these equal height');

    await expect(page.locator('[data-editui="copy-item"]')).toHaveCount(0);
    await page.locator('[data-editui="copied-note"]').first().click();
    await expect(page.locator('[data-editui="copy-item"]')).toBeVisible();
    await expect(page.locator('[data-editui="note-input"]')).toBeVisible();
    const input = await page.locator('[data-editui="note-input"]').boundingBox();
    const copyItem = await page.locator('[data-editui="copy-item"]').boundingBox();
    if (!input || !copyItem) throw new Error('note input or copy button is not visible');
    expect(copyItem.x).toBeCloseTo(input.x, 0);
    expect(copyItem.width).toBeCloseTo(input.width, 0);
    expect(copyItem.y).toBeGreaterThan(input.y + input.height);
    await page.locator('[data-editui="more"]').click();
    await page.locator('[data-editui="revise"]').click();
    await expect(page.locator('[data-editui="copied-note"]')).toHaveCount(1);
    await expect(page.locator('[data-editui="copy-all"]')).toBeEnabled();
    await expect(page.locator('[data-editui="note-input"]')).toBeVisible();
    await expect(page.locator('[data-editui="tray"] h2')).toHaveText('EditUI — 2 edits');
  } finally {
    await context.close();
    await fixtureServer.close();
  }
});
