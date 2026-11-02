import { describe, expect, it } from 'vitest';
import { publishChromeStore } from './publish-chrome';

const input = {
  publisherId: 'pub-1',
  clientId: 'client',
  clientSecret: 'secret',
  refreshToken: 'refresh',
  version: '1.0.2',
  zip: new Uint8Array([1, 2, 3]),
  sleep: async () => {},
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('publishChromeStore', () => {
  it('uploads the zip and submits it for review', async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (url, init) => {
      calls.push(`${init?.method ?? 'GET'} ${url.toString()}`);
      if (String(url).endsWith('/token')) return json({ access_token: 'token' });
      if (String(url).includes(':upload')) return json({ uploadState: 'SUCCEEDED', crxVersion: '1.0.2' });
      return json({ state: 'ITEM_PENDING_REVIEW' });
    };
    await expect(publishChromeStore({ ...input, fetch: fetchImpl })).resolves.toBe('published');
    expect(calls).toEqual([
      'POST https://oauth2.googleapis.com/token',
      'POST https://chromewebstore.googleapis.com/upload/v2/publishers/pub-1/items/kolehloegjbpkeehflbdkjkdmljobfak:upload',
      'POST https://chromewebstore.googleapis.com/v2/publishers/pub-1/items/kolehloegjbpkeehflbdkjkdmljobfak:publish',
    ]);
  });

  it('waits until an in-progress upload finishes', async () => {
    let statusCalls = 0;
    const fetchImpl: typeof fetch = async (url) => {
      if (String(url).endsWith('/token')) return json({ access_token: 'token' });
      if (String(url).includes(':upload')) return json({ uploadState: 'IN_PROGRESS' });
      if (String(url).includes(':fetchStatus')) {
        statusCalls += 1;
        return json({ lastAsyncUploadState: statusCalls === 1 ? 'IN_PROGRESS' : 'SUCCEEDED' });
      }
      return json({});
    };
    await expect(publishChromeStore({ ...input, fetch: fetchImpl })).resolves.toBe('published');
    expect(statusCalls).toBe(2);
  });

  it('succeeds when this version is already uploaded', async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (url, init) => {
      calls.push(`${init?.method ?? 'GET'} ${url.toString()}`);
      if (String(url).endsWith('/token')) return json({ access_token: 'token' });
      if (String(url).includes(':upload')) return json({ error: { message: 'You have already uploaded version 1.0.2' } }, 400);
      return json({ error: { message: 'This item is already submitted for review' } }, 400);
    };
    await expect(publishChromeStore({ ...input, fetch: fetchImpl })).resolves.toBe('already');
    expect(calls).toContain(
      'POST https://chromewebstore.googleapis.com/v2/publishers/pub-1/items/kolehloegjbpkeehflbdkjkdmljobfak:publish',
    );
  });

  it('stops when the store received a different version', async () => {
    const fetchImpl: typeof fetch = async (url) => {
      if (String(url).endsWith('/token')) return json({ access_token: 'token' });
      return json({ uploadState: 'SUCCEEDED', crxVersion: '1.0.1' });
    };
    await expect(publishChromeStore({ ...input, fetch: fetchImpl })).rejects.toThrow('Chrome received 1.0.1, expected 1.0.2');
  });

  it('stops when the package is not newer than the published version', async () => {
    const fetchImpl: typeof fetch = async (url) => {
      if (String(url).endsWith('/token')) return json({ access_token: 'token' });
      return json({ error: { message: 'The version must be greater than the published version' } }, 400);
    };
    await expect(publishChromeStore({ ...input, fetch: fetchImpl })).rejects.toThrow(/greater than/);
  });
});
