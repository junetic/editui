import type { Edit, SentBatch } from './types';

function isEdit(value: unknown): value is Edit {
  if (typeof value !== 'object' || value === null) return false;
  const edit = value as Partial<Edit>;
  return typeof edit.id === 'string' && typeof edit.instruction === 'string' && Array.isArray(edit.elements);
}

export async function loadEdits(key: string): Promise<Edit[]> {
  const stored = await browser.storage.local.get(key);
  const value = stored[key];
  if (!Array.isArray(value)) return [];
  return value.filter(isEdit);
}

export async function saveEdits(key: string, edits: Edit[]): Promise<void> {
  await browser.storage.local.set({ [key]: edits });
}

function isSentBatch(value: unknown): value is SentBatch {
  if (typeof value !== 'object' || value === null) return false;
  const batch = value as Partial<SentBatch>;
  return typeof batch.id === 'string' && typeof batch.sentAt === 'number' && typeof batch.prompt === 'string' && Array.isArray(batch.edits);
}

export async function loadSent(key: string): Promise<SentBatch[]> {
  const stored = await browser.storage.local.get(key);
  const value = stored[key];
  if (!Array.isArray(value)) return [];
  return value.filter(isSentBatch);
}

export async function saveSent(key: string, batches: SentBatch[]): Promise<void> {
  await browser.storage.local.set({ [key]: batches });
}
