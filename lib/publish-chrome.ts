import { CHROME_EXTENSION_ID, submissionState } from './store-package.ts';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export interface PublishChromeInput {
  publisherId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  version: string;
  zip: Uint8Array;
  fetch: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
}

interface ChromeUploadBody {
  uploadState?: string;
  crxVersion?: string;
  lastAsyncUploadState?: string;
  error?: { message?: string };
}

export async function publishChromeStore(input: PublishChromeInput): Promise<'published' | 'already'> {
  const sleep = input.sleep ?? delay;
  const token = await accessToken(input);
  const uploadUrl = `https://chromewebstore.googleapis.com/upload/v2/publishers/${input.publisherId}/items/${CHROME_EXTENSION_ID}:upload`;
  const upload = await requestJson(input.fetch, uploadUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/zip' },
    body: packageBytes(input.zip),
  });
  const uploaded = await settleUpload(upload, input, token, sleep);
  const publishUrl = `https://chromewebstore.googleapis.com/v2/publishers/${input.publisherId}/items/${CHROME_EXTENSION_ID}:publish`;
  const published = await requestJson(input.fetch, publishUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (published.outcome === 'failed') throw new Error(published.detail);
  if (uploaded === 'already' || published.outcome === 'already') return 'already';
  return 'published';
}

async function accessToken(input: PublishChromeInput): Promise<string> {
  const body = new URLSearchParams({
    client_id: input.clientId,
    client_secret: input.clientSecret,
    refresh_token: input.refreshToken,
    grant_type: 'refresh_token',
  });
  const response = await input.fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const payload = (await response.json()) as { access_token?: string; error_description?: string };
  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || 'Chrome token request failed');
  }
  return payload.access_token;
}

async function settleUpload(
  initial: ParsedResponse,
  input: PublishChromeInput,
  token: string,
  sleep: (ms: number) => Promise<void>,
): Promise<'ready' | 'already'> {
  let current = initial;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const state = uploadState(current.body);
    if (current.outcome === 'already' || submissionState(current.detail) === 'already') return 'already';
    if (current.outcome === 'failed' || state === 'FAILED') throw new Error(current.detail || 'Chrome upload failed');
    if (state === 'SUCCEEDED' || state === 'SUCCESS') {
      const version = current.body.crxVersion;
      if (version && version !== input.version) throw new Error(`Chrome received ${version}, expected ${input.version}`);
      return 'ready';
    }
    if (state !== 'IN_PROGRESS' && state !== 'UPLOAD_IN_PROGRESS' && current.outcome === 'ok') {
      throw new Error(current.detail || 'Chrome upload did not finish');
    }
    await sleep(2_000);
    const statusUrl = `https://chromewebstore.googleapis.com/v2/publishers/${input.publisherId}/items/${CHROME_EXTENSION_ID}:fetchStatus`;
    current = await requestJson(input.fetch, statusUrl, { headers: { Authorization: `Bearer ${token}` } });
  }
  throw new Error('Chrome upload did not finish');
}

function uploadState(body: ChromeUploadBody): string {
  return body.uploadState || body.lastAsyncUploadState || '';
}

interface ParsedResponse {
  outcome: 'ok' | 'already' | 'failed';
  detail: string;
  body: ChromeUploadBody;
}

async function requestJson(fetchImpl: typeof fetch, url: string, init: RequestInit): Promise<ParsedResponse> {
  const response = await fetchImpl(url, init);
  const text = await response.text();
  const body = parseBody(text);
  const detail = body.error?.message || text;
  if (submissionState(detail) === 'already') return { outcome: 'already', detail, body };
  if (!response.ok || submissionState(detail) === 'rejected') return { outcome: 'failed', detail, body };
  return { outcome: 'ok', detail, body };
}

function parseBody(text: string): ChromeUploadBody {
  if (!text) return {};
  try {
    return JSON.parse(text) as ChromeUploadBody;
  } catch {
    return {};
  }
}

function packageBytes(value: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(value.byteLength);
  new Uint8Array(copy).set(value);
  return copy;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
