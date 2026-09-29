import { beforeEach, describe, expect, it } from 'vitest';
import { captureElement } from './context';

describe('captureElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps readable markup and drops style, handlers, and oversized html', () => {
    const longTitle = 't'.repeat(400);
    document.body.innerHTML = `
      <section class="hero py-24">
        <p class="eyebrow">Plans</p>
        <h1 class="text-6xl font-medium css-abc123" style="color:red" onclick="alert(1)" title="${longTitle}">
          Pricing that scales
        </h1>
        <p class="mt-6">Support</p>
      </section>
    `;
    const heading = document.querySelector('h1');
    if (!heading) throw new Error('missing heading');
    const context = captureElement(heading);

    expect(context.tag).toBe('h1');
    expect(context.text).toBe('Pricing that scales');
    expect(context.classes).toContain('text-6xl');
    expect(context.classes).toContain('css-abc123');
    expect(context.outerHTML).toContain('text-6xl');
    expect(context.outerHTML).not.toContain('css-abc123');
    expect(context.outerHTML).not.toContain('style=');
    expect(context.outerHTML).not.toContain('onclick');
    expect(context.outerHTML.length).toBeLessThanOrEqual(1500);
    expect(context.parentContext).toContain('<section');
    expect(context.parentContext).toContain('hero');
    expect(context.siblingContext).toContain('Plans');
    expect(context.siblingContext).toContain('Support');
    expect(context.attributes.title?.length).toBeLessThanOrEqual(120);
  });

  it('collapses a deep tree instead of dumping it', () => {
    const children = Array.from({ length: 12 }, (_, index) => `<p>Block ${index} ${'word '.repeat(30)}</p>`).join('');
    document.body.innerHTML = `<div id="stack">${children}</div>`;
    const stack = document.querySelector('#stack');
    if (!stack) throw new Error('missing stack');
    const context = captureElement(stack);
    expect(context.outerHTML.length).toBeLessThanOrEqual(1500);
    expect(context.outerHTML).toContain('…');
  });
});
