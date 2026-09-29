import { describe, expect, it } from 'vitest';
import { noteLine, rememberBatch, reopenEdit, SENT_BATCH_LIMIT, withoutNote } from './history';
import type { Edit, SentBatch } from './types';

function batch(id: string): SentBatch {
  return {
    id,
    sentAt: 1,
    page: { url: 'http://localhost:3000/pricing', pathname: '/pricing', title: 'Pricing' },
    viewport: { width: 1440, height: 900 },
    edits: [],
    prompt: id,
  };
}

function edit(instruction: string): Edit {
  return {
    id: 'edit_1',
    instruction,
    createdAt: 1,
    page: { url: 'http://localhost:3000/pricing', pathname: '/pricing', title: 'Pricing' },
    viewport: { width: 1440, height: 900 },
    elements: [],
    fingerprints: [],
    matchState: 'matched',
  };
}

describe('rememberBatch', () => {
  it('keeps the newest batch first and drops the oldest past the limit', () => {
    const existing = Array.from({ length: SENT_BATCH_LIMIT }, (_, index) => batch(`sent_${index}`));
    const next = rememberBatch(existing, batch('sent_new'));
    expect(next).toHaveLength(SENT_BATCH_LIMIT);
    expect(next[0]?.id).toBe('sent_new');
    expect(next.some((item) => item.id === 'sent_19')).toBe(false);
  });
});

describe('withoutNote', () => {
  it('drops a copied note and removes the batch when it is the last one', () => {
    const first = { ...edit('Tighten this section'), id: 'edit_1' };
    const second = { ...edit('Make the heading smaller'), id: 'edit_2' };
    const stored = { ...batch('sent_1'), edits: [first, second], prompt: 'old prompt' };
    const remaining = withoutNote([stored], 'sent_1', 'edit_1');
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.edits.map((item) => item.id)).toEqual(['edit_2']);
    expect(remaining[0]?.prompt).toContain('Make the heading smaller');
    expect(remaining[0]?.prompt).not.toContain('Tighten this section');
    expect(withoutNote(remaining, 'sent_1', 'edit_2')).toEqual([]);
  });
});

describe('reopenEdit', () => {
  it('copies a sent note back without changing the stored one', () => {
    const source = edit('Tighten this section');
    const reopened = reopenEdit(source, 50);
    reopened.instruction = 'Changed locally';
    expect(reopened.id).not.toBe(source.id);
    expect(reopened.createdAt).toBe(50);
    expect(source.instruction).toBe('Tighten this section');
  });
});

describe('noteLine', () => {
  it('uses the first line of the instruction', () => {
    expect(noteLine('Tighten spacing\nKeep the type size')).toBe('Tighten spacing');
  });
});
