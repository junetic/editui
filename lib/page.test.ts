import { describe, expect, it } from 'vitest';
import { moveItem } from './list';
import { pageStorageKey } from './page';

describe('pageStorageKey', () => {
  it('keys edits by origin and pathname', () => {
    expect(pageStorageKey('http://localhost:3000/pricing?plan=pro#hero')).toBe('edits:http://localhost:3000/pricing');
  });
});

describe('moveItem', () => {
  it('swaps an edit toward the start or end', () => {
    expect(moveItem(['a', 'b', 'c'], 1, -1)).toEqual(['b', 'a', 'c']);
    expect(moveItem(['a', 'b', 'c'], 0, -1)).toEqual(['a', 'b', 'c']);
  });
});
