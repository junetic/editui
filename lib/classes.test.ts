import { describe, expect, it } from 'vitest';
import { isHashedClass, isStableId } from './classes';

describe('class and id filters', () => {
  it('keeps readable utility classes and drops generated hashes', () => {
    expect(isHashedClass('text-6xl')).toBe(false);
    expect(isHashedClass('font-medium')).toBe(false);
    expect(isHashedClass('feature-card')).toBe(false);
    expect(isHashedClass('css-abc123')).toBe(true);
    expect(isHashedClass('sc-bdVaJa')).toBe(true);
    expect(isHashedClass('Card_title__a1b2c')).toBe(true);
  });

  it('rejects framework-generated ids', () => {
    expect(isStableId('hero-heading')).toBe(true);
    expect(isStableId(':r1:')).toBe(false);
    expect(isStableId('radix-:r5:')).toBe(false);
  });
});
