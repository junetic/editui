import { finder } from '@medv/finder';
import { isHashedClass, isStableId } from './classes';

export function buildSelector(element: Element): string {
  try {
    const root = document.body.contains(element) ? document.body : document.documentElement;
    return finder(element, {
      root,
      timeoutMs: 800,
      seedMinLength: 1,
      optimizedMinLength: 2,
      idName: isStableId,
      className: (name) => !isHashedClass(name),
      attr: (name, value) =>
        name === 'data-testid' || (name === 'aria-label' && value.length > 0 && value.length < 80),
    });
  } catch {
    return fallbackSelector(element);
  }
}

export function fallbackSelector(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  let depth = 0;
  while (current && current !== document.body && current !== document.documentElement && depth < 5) {
    const node: Element = current;
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const tag = node.tagName.toLowerCase();
    const siblings = [...parent.children].filter((child) => child.tagName === node.tagName);
    const index = siblings.indexOf(node) + 1;
    parts.unshift(`${tag}:nth-of-type(${index})`);
    current = parent;
    depth += 1;
  }
  return parts.join(' > ');
}
