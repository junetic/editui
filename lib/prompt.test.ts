import { describe, expect, it } from 'vitest';
import { formatPrompt } from './prompt';
import type { Edit } from './types';

const edits: Edit[] = [
  {
    id: 'edit_1',
    instruction: 'Make this heading slightly smaller',
    createdAt: 1,
    page: { url: 'http://localhost:3000/pricing', pathname: '/pricing', title: 'Pricing' },
    viewport: { width: 1440, height: 900 },
    elements: [
      {
        tag: 'h1',
        text: 'Pricing that scales with your research',
        id: null,
        classes: ['text-6xl', 'font-medium', 'css-abc123'],
        attributes: {},
        selector: 'h1.text-6xl',
        outerHTML: '<h1 class="text-6xl font-medium">Pricing that scales with your research</h1>',
        parentContext: '<section class="hero py-24">',
        siblingContext: 'after: <p class="mt-6">Support</p>',
        computedStyles: { display: 'block', 'font-size': '60px' },
        bounds: { x: 182, y: 260, width: 710, height: 144 },
        role: null,
      },
    ],
    fingerprints: ['h1'],
    matchState: 'matched',
  },
  {
    id: 'edit_2',
    instruction: 'Make these equal height',
    createdAt: 2,
    page: { url: 'http://localhost:3000/pricing', pathname: '/pricing', title: 'Pricing' },
    viewport: { width: 1440, height: 900 },
    elements: [
      {
        tag: 'article',
        text: 'Fast review',
        id: null,
        classes: ['feature-card'],
        attributes: {},
        selector: '[data-testid="card-one"]',
        outerHTML: '<article class="feature-card">Fast review</article>',
        parentContext: '',
        siblingContext: '',
        computedStyles: {},
        bounds: { x: 10, y: 20, width: 30, height: 40 },
        role: null,
      },
    ],
    fingerprints: ['article'],
    matchState: 'matched',
  },
];

describe('formatPrompt', () => {
  it('builds one prompt for the whole batch', () => {
    const page = edits[0]?.page;
    if (!page) throw new Error('missing page');
    const prompt = formatPrompt(edits, page, { width: 1440, height: 900 });
    expect(prompt).toContain('`http://localhost:3000/pricing`');
    expect(prompt).toContain('Viewport: 1440×900');
    expect(prompt).toContain('following 2 UI changes');
    expect(prompt).toContain('## Edit 1 — Pricing that scales with your research');
    expect(prompt).toContain('Make this heading slightly smaller');
    expect(prompt).toContain('`<h1 class="text-6xl font-medium">`');
    expect(prompt).not.toContain('css-abc123');
    expect(prompt).toContain('Pricing that scales with your research');
    expect(prompt).toContain('<section class="hero py-24">');
    expect(prompt).toContain('Make these equal height');
    expect(prompt).toContain('Fast review');
    expect(prompt).toContain('Implement all requested changes');
  });
});
