import { createHmac, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { FIREFOX_EXTENSION_ID, submissionState } from './store-package.ts';

const AMO_ORIGIN = 'https://addons.mozilla.org/api/v5';

export interface FirefoxListing {
  slug: string;
  license: string;
  name: { 'en-US': string };
  summary: { 'en-US': string };
  homepage: { 'en-US': string };
  categories: { firefox: string[] };
}

export interface PublishFirefoxInput {
  version: string;
  zip: Uint8Array;
  source: Uint8Array;
  listing: FirefoxListing;
  issuer: string;
  secret: string;
  fetch: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  nowSeconds?: number;
  jti?: string;
}

export function amoJwt(issuer: string, secret: string, nowSeconds: number, jti: string): string {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Url(JSON.stringify({ iss: issuer, jti, iat: nowSeconds, exp: nowSeconds + 300 }));
  const unsigned = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

export function parseFirefoxListing(value: unknown): FirefoxListing {
  const listing = value as FirefoxListing;
  if (!listing?.slug || !listing.license || !listing.name?.['en-US'] || !listing.summary?.['en-US']) {
    throw new Error('Firefox listing is missing slug, license, name, or summary');
  }
  if (!listing.categories?.firefox?.length) throw new Error('Firefox listing is missing a category');
  return listing;
}

export function readFirefoxListing(path: string): FirefoxListing {
  return parseFirefoxListing(JSON.parse(readFileSync(path, 'utf8')));
}

export function firefoxAddonBody(uploadUuid: string, listing: FirefoxListing): Record<string, unknown> {
  return {
    slug: listing.slug,
    name: listing.name,
    summary: listing.summary,
    homepage: listing.homepage,
    categories: listing.categories,
    version: {
      upload: uploadUuid,
      license: listing.license,
      compatibility: ['firefox'],
    },
  };
}

export async function publishFirefoxAddon(input: PublishFirefoxInput): Promise<'published' | 'already'> {
  const sleep = input.sleep ?? delay;
  const token = amoJwt(input.issuer, input.secret, input.nowSeconds ?? Math.floor(Date.now() / 1000), input.jti ?? randomUUID());
  const auth = { Authorization: `JWT ${token}` };
  const upload = await uploadPackage(input, auth, sleep);
  if (upload === 'invalid') {
    await attachSource(input, auth);
    return 'already';
  }
  const guid = encodeURIComponent(FIREFOX_EXTENSION_ID);
  const created = await requestJson(input.fetch, `${AMO_ORIGIN}/addons/addon/${guid}/`, {
    method: 'PUT',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(firefoxAddonBody(upload, input.listing)),
  });
  if (created.outcome === 'failed') throw new Error(created.detail);
  await attachSource(input, auth);
  return created.outcome === 'already' ? 'already' : 'published';
}

async function uploadPackage(
  input: PublishFirefoxInput,
  auth: { Authorization: string },
  sleep: (ms: number) => Promise<void>,
): Promise<string | 'invalid'> {
  const form = new FormData();
  form.append('upload', new Blob([packageBytes(input.zip)], { type: 'application/zip' }), `editui-${input.version}-firefox.zip`);
  form.append('channel', 'listed');
  const uploaded = await requestJson(input.fetch, `${AMO_ORIGIN}/addons/upload/`, { method: 'POST', headers: auth, body: form });
  if (uploaded.outcome === 'failed') throw new Error(uploaded.detail);
  const uuid = uploaded.body.uuid;
  if (!uuid) throw new Error('Firefox upload did not return an id');
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const status = await requestJson(input.fetch, `${AMO_ORIGIN}/addons/upload/${uuid}/`, { headers: auth });
    if (status.outcome === 'failed') throw new Error(status.detail);
    if (status.body.processed) {
      if (status.body.valid) return uuid;
      const detail = validationDetail(status.body);
      if (submissionState(detail) === 'already') return 'invalid';
      throw new Error(detail || 'Firefox rejected the package');
    }
    await sleep(3_000);
  }
  throw new Error('Firefox upload did not finish');
}

async function attachSource(input: PublishFirefoxInput, auth: { Authorization: string }): Promise<void> {
  const form = new FormData();
  form.append('source', new Blob([packageBytes(input.source)], { type: 'application/zip' }), `editui-${input.version}-sources.zip`);
  const guid = encodeURIComponent(FIREFOX_EXTENSION_ID);
  const result = await requestJson(input.fetch, `${AMO_ORIGIN}/addons/addon/${guid}/versions/v${input.version}/`, {
    method: 'PATCH',
    headers: auth,
    body: form,
  });
  if (result.outcome === 'failed') throw new Error(result.detail);
}

interface UploadBody {
  uuid?: string;
  processed?: boolean;
  valid?: boolean;
  validation?: { messages?: Array<{ message?: string; type?: string }> };
  error?: string;
  detail?: string;
}

interface ParsedResponse {
  outcome: 'ok' | 'already' | 'failed';
  detail: string;
  body: UploadBody;
}

async function requestJson(fetchImpl: typeof fetch, url: string, init: RequestInit): Promise<ParsedResponse> {
  const response = await fetchImpl(url, init);
  const text = await response.text();
  const body = parseBody(text);
  const detail = body.error || body.detail || text;
  if (submissionState(detail) === 'already') return { outcome: 'already', detail, body };
  if (!response.ok || submissionState(detail) === 'rejected') return { outcome: 'failed', detail, body };
  return { outcome: 'ok', detail, body };
}

function validationDetail(body: UploadBody): string {
  const messages = body.validation?.messages?.map((item) => item.message).filter(Boolean) ?? [];
  return messages.join('\n') || 'Firefox rejected the package';
}

function parseBody(text: string): UploadBody {
  if (!text) return {};
  try {
    return JSON.parse(text) as UploadBody;
  } catch {
    return {};
  }
}

function packageBytes(value: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(value.byteLength);
  new Uint8Array(copy).set(value);
  return copy;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
