import { expect, test, chromium } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const fixture = readFileSync(path.resolve('fixtures/review.html'));

test('toggles edit mode with Command-Shift-E', async () => {
  const server: Server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(fixture);
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('fixture server has no port');

  const extensionPath = path.resolve('output/chrome-mv3');
  const context = await chromium.launchPersistentContext('', {
    headless: false,
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });

  try {
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await expect(async () => {
      if ((await page.locator('[data-editui="editing"]').count()) === 0) {
        await page.keyboard.press('Shift+Meta+KeyE');
      }
      await expect(page.locator('[data-editui="editing"]')).toBeAttached();
    }).toPass({ timeout: 15_000 });

    await page.locator('#hero-heading').click();
    const prompt = page.locator('[data-editui="prompt-input"]');
    await expect(prompt).toBeFocused();
    await page.waitForTimeout(350);
    await page.keyboard.press('Shift+Meta+KeyE');
    await expect(page.locator('[data-editui="editing"]')).toHaveCount(0);
  } finally {
    await context.close();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
