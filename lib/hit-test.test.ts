import { describe, expect, it } from 'vitest';
import { isSelectable, preferredTarget } from './hit-test';

function withBox(element: HTMLElement, width = 120, height = 32): HTMLElement {
  element.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      toJSON: () => ({}),
    }) as DOMRect;
  return element;
}

describe('hit testing', () => {
  it('skips document infrastructure and invisible elements', () => {
    const script = withBox(document.createElement('script'));
    const hidden = withBox(document.createElement('div'));
    hidden.style.display = 'none';
    const button = withBox(document.createElement('button'));
    expect(isSelectable(script)).toBe(false);
    expect(isSelectable(hidden)).toBe(false);
    expect(isSelectable(button)).toBe(true);
  });

  it('climbs from an anonymous inline span to the heading', () => {
    document.body.innerHTML = '<h1 id="hero" style="display:block"><span style="display:inline">Pricing</span></h1>';
    const heading = document.querySelector('h1');
    const span = document.querySelector('span');
    if (!heading || !span) throw new Error('missing nodes');
    withBox(heading as HTMLElement, 200, 48);
    withBox(span as HTMLElement, 80, 20);
    expect(preferredTarget(span)).toBe(heading);
  });
});
