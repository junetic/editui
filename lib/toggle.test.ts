import { afterEach, describe, expect, it, vi } from 'vitest';
import { emitToggle, onToggle } from './toggle';

describe('emitToggle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('collapses a second toggle from the same shortcut', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    const seen: number[] = [];
    const stop = onToggle(() => seen.push(seen.length));
    emitToggle();
    emitToggle();
    expect(seen).toEqual([0]);
    vi.setSystemTime(1_301);
    emitToggle();
    expect(seen).toEqual([0, 1]);
    stop();
  });
});
