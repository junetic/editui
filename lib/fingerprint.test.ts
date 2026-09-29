import { beforeEach, describe, expect, it } from 'vitest';
import { captureElement } from './context';
import { fingerprintFor, rematchEdit } from './fingerprint';
import type { Edit } from './types';

function editFor(element: Element): Edit {
  const captured = captureElement(element);
  return {
    id: 'edit_1',
    instruction: 'Make this smaller',
    createdAt: 1,
    page: { url: 'http://localhost:3000/pricing', pathname: '/pricing', title: 'Pricing' },
    viewport: { width: 1440, height: 900 },
    elements: [captured],
    fingerprints: [fingerprintFor(captured)],
    matchState: 'matched',
  };
}

describe('rematchEdit', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('finds the original element', () => {
    document.body.innerHTML = '<h1 id="hero" class="text-6xl">Pricing that scales</h1>';
    const heading = document.querySelector('h1');
    if (!heading) throw new Error('missing heading');
    const result = rematchEdit(document, editFor(heading));
    expect(result.state).toBe('matched');
    expect(result.elements[0]).toBe(heading);
  });

  it('finds a rebuilt element with the same text and classes', () => {
    document.body.innerHTML = '<h1 id="hero" class="text-6xl">Pricing that scales</h1>';
    const heading = document.querySelector('h1');
    if (!heading) throw new Error('missing heading');
    const edit = editFor(heading);
    document.body.innerHTML = '<h1 id="hero" class="text-6xl">Pricing that scales</h1>';
    const result = rematchEdit(document, edit);
    expect(result.state).toBe('matched');
    expect(result.elements[0]?.id).toBe('hero');
  });

  it('marks the edit changed when the element is gone', () => {
    document.body.innerHTML = '<h1 id="hero" class="text-6xl">Pricing that scales</h1>';
    const heading = document.querySelector('h1');
    if (!heading) throw new Error('missing heading');
    const edit = editFor(heading);
    document.body.innerHTML = '<p>Gone</p>';
    expect(rematchEdit(document, edit).state).toBe('changed');
  });
});
