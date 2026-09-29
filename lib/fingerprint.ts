import { isHashedClass } from './classes';
import { collapseWhitespace, visibleText } from './text';
import type { Edit, ElementContext } from './types';

export interface RematchResult {
  state: 'matched' | 'changed';
  elements: Element[];
}

export function fingerprintFor(element: ElementContext): string {
  const classes = element.classes.filter((name) => !isHashedClass(name)).slice(0, 8);
  return [element.tag, element.selector, element.text.slice(0, 80), classes.join('.')].join('|');
}

export function rematchEdit(doc: Document, edit: Edit): RematchResult {
  const found: Element[] = [];
  for (const context of edit.elements) {
    const match = findElement(doc, context);
    if (!match) return { state: 'changed', elements: [] };
    found.push(match);
  }
  return { state: 'matched', elements: found };
}

function findElement(doc: Document, context: ElementContext): Element | null {
  const bySelector = queryFirst(doc, context.selector);
  if (bySelector && scoreElement(bySelector, context) >= 0.5) return bySelector;

  const candidates = doc.getElementsByTagName(context.tag);
  let best: Element | null = null;
  let bestScore = 0;
  const limit = Math.min(candidates.length, 500);
  for (let index = 0; index < limit; index += 1) {
    const candidate = candidates[index];
    if (!candidate) continue;
    const score = scoreElement(candidate, context);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  if (best && bestScore >= 0.75) return best;
  return null;
}

function queryFirst(doc: Document, selector: string): Element | null {
  if (!selector) return null;
  try {
    return doc.querySelector(selector);
  } catch {
    return null;
  }
}

function scoreElement(element: Element, context: ElementContext): number {
  let score = 0;
  if (element.tagName.toLowerCase() === context.tag) score += 0.25;
  const text = visibleText(element);
  if (context.text && text === context.text) score += 0.45;
  else if (context.text && (text.includes(context.text) || context.text.includes(text))) score += 0.3;
  else if (!context.text && !collapseWhitespace(element.textContent ?? '')) score += 0.15;

  const expected = context.classes.filter((name) => !isHashedClass(name));
  if (expected.length) {
    const overlap = expected.filter((name) => element.classList.contains(name)).length / expected.length;
    score += overlap * 0.3;
  } else {
    score += 0.15;
  }
  if (context.id && element.id === context.id) score += 0.2;
  return score;
}
