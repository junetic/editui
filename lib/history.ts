import { formatPrompt } from './prompt';
import { truncate } from './text';
import type { Edit, SentBatch } from './types';

export const SENT_BATCH_LIMIT = 20;

export function rememberBatch(history: readonly SentBatch[], batch: SentBatch): SentBatch[] {
  return [batch, ...history.filter((item) => item.id !== batch.id)].slice(0, SENT_BATCH_LIMIT);
}

export function withoutNote(history: readonly SentBatch[], batchId: string, editId: string): SentBatch[] {
  return history.flatMap((batch) => {
    if (batch.id !== batchId) return [batch];
    const edits = batch.edits.filter((edit) => edit.id !== editId);
    if (!edits.length) return [];
    return [{ ...batch, edits, prompt: formatPrompt(edits, batch.page, batch.viewport) }];
  });
}

export function reopenEdit(edit: Edit, now = Date.now()): Edit {
  const copy = structuredClone(edit);
  return {
    ...copy,
    id: `edit_${crypto.randomUUID()}`,
    createdAt: now,
    matchState: 'matched',
  };
}

export function sentLabel(sentAt: number, now = Date.now()): string {
  const sent = new Date(sentAt);
  const time = sent.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (new Date(now).toDateString() === sent.toDateString()) return time;
  const day = sent.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${day} ${time}`;
}

export function noteLine(instruction: string): string {
  const line = instruction.split('\n')[0] ?? instruction;
  return truncate(line, 80);
}
