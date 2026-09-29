import { beforeEach, describe, expect, it } from 'vitest';
import { buildSelector } from './selector';

describe('buildSelector', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('points at the element and skips hashed class names', () => {
    document.body.innerHTML = `
      <section id="pricing">
        <h1 class="css-abc123 text-6xl font-medium" data-testid="hero">Pricing</h1>
      </section>
    `;
    const heading = document.querySelector('h1');
    if (!heading) throw new Error('missing heading');
    const selector = buildSelector(heading);
    expect(selector).not.toContain('css-abc123');
    expect(document.querySelector(selector)).toBe(heading);
  });
});
