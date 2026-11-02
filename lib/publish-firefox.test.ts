import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { amoJwt, firefoxAddonBody, parseFirefoxListing, publishFirefoxAddon, readFirefoxListing } from './publish-firefox';

const listing = parseFirefoxListing({
  slug: 'editui',
  license: 'MIT',
  name: { 'en-US': 'EditUI' },
  summary: { 'en-US': 'Point at your UI and copy one prompt.' },
  homepage: { 'en-US': 'https://www.editui.app' },
  categories: { firefox: ['web-development'] },
});

const input = {
  version: '1.0.2',
  zip: new Uint8Array([1]),
  source: new Uint8Array([2]),
  listing,
  issuer: 'user:1:2',
  secret: 'secret',
  nowSeconds: 1_700_000_000,
  jti: 'jti-1',
  sleep: async () => {},
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

describe('amoJwt', () => {
  it('signs a short-lived token for the Add-ons issuer', () => {
    const token = amoJwt('user:1:2', 'secret', 1_700_000_000, 'jti-1');
    const [header, payload, signature] = token.split('.');
    expect(JSON.parse(Buffer.from(header ?? '', 'base64url').toString())).toMatchObject({ alg: 'HS256' });
    expect(JSON.parse(Buffer.from(payload ?? '', 'base64url').toString())).toMatchObject({
      iss: 'user:1:2',
      jti: 'jti-1',
      exp: 1_700_000_300,
    });
    const expected = createHmac('sha256', 'secret').update(`${header}.${payload}`).digest('base64url');
    expect(signature).toBe(expected);
  });
});

describe('firefoxAddonBody', () => {
  it('submits the upload as a listed Firefox version', () => {
    expect(firefoxAddonBody('upload-1', listing)).toMatchObject({
      slug: 'editui',
      version: { upload: 'upload-1', license: 'MIT', compatibility: ['firefox'] },
    });
  });
});

describe('readFirefoxListing', () => {
  it('reads the store listing file', () => {
    expect(readFirefoxListing('store/firefox-listing.json').categories.firefox).toEqual(['web-development']);
  });
});

describe('publishFirefoxAddon', () => {
  it('uploads the package, creates the version, and attaches source', async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (url, init) => {
      const address = url.toString();
      calls.push(`${init?.method ?? 'GET'} ${address}`);
      expect(init?.headers).toMatchObject({ Authorization: expect.stringMatching(/^JWT /) });
      if (address.endsWith('/upload/') && init?.method === 'POST') return json({ uuid: 'upload-1' });
      if (address.endsWith('/upload/upload-1/')) return json({ processed: true, valid: true });
      if (init?.method === 'PUT') return json({ guid: 'editui@editui.app' });
      return json({ version: '1.0.2' });
    };
    await expect(publishFirefoxAddon({ ...input, fetch: fetchImpl })).resolves.toBe('published');
    expect(calls.map((call) => call.replace('https://addons.mozilla.org/api/v5', ''))).toEqual([
      'POST /addons/upload/',
      'GET /addons/upload/upload-1/',
      'PUT /addons/addon/editui%40editui.app/',
      'PATCH /addons/addon/editui%40editui.app/versions/v1.0.2/',
    ]);
  });

  it('attaches source when the version was already submitted', async () => {
    const calls: string[] = [];
    const fetchImpl: typeof fetch = async (url, init) => {
      calls.push(init?.method ?? 'GET');
      if (String(url).endsWith('/upload/') && init?.method === 'POST') return json({ uuid: 'upload-1' });
      if (String(url).includes('/upload/upload-1/')) {
        return json({ processed: true, valid: false, validation: { messages: [{ message: 'Version 1.0.2 already exists.' }] } });
      }
      return json({});
    };
    await expect(publishFirefoxAddon({ ...input, fetch: fetchImpl })).resolves.toBe('already');
    expect(calls).toContain('PATCH');
  });

  it('stops when Add-ons rejects the package', async () => {
    const fetchImpl: typeof fetch = async (url, init) => {
      if (String(url).endsWith('/upload/') && init?.method === 'POST') return json({ uuid: 'upload-1' });
      return json({
        processed: true,
        valid: false,
        validation: { messages: [{ message: 'The version must be greater than the published version' }] },
      });
    };
    await expect(publishFirefoxAddon({ ...input, fetch: fetchImpl })).rejects.toThrow(/greater than/);
  });
});
