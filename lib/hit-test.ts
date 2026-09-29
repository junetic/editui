import { isHashedClass } from './classes';

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'LINK',
  'META',
  'HEAD',
  'NOSCRIPT',
  'HTML',
  'BODY',
  'BR',
  'WBR',
  'EDIT-UI',
]);

export function isEditUiEvent(event: Event): boolean {
  return event.composedPath().some((node) => node instanceof Element && node.hasAttribute('data-editui-root'));
}

export function isSelectable(element: Element): boolean {
  if (SKIP_TAGS.has(element.tagName)) return false;
  if (isInsideEditUi(element)) return false;
  const style = getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  const rect = element.getBoundingClientRect();
  return rect.width >= 4 && rect.height >= 4;
}

function isInsideEditUi(element: Element): boolean {
  if (element.hasAttribute('data-editui-root')) return true;
  const root = element.getRootNode();
  return root instanceof ShadowRoot && root.host.hasAttribute('data-editui-root');
}

export function elementAtPoint(x: number, y: number, doc: Document = document): Element | null {
  const stack = doc.elementsFromPoint(x, y);
  for (const element of stack) {
    if (!isSelectable(element)) continue;
    return preferredTarget(element);
  }
  return null;
}

export function preferredTarget(element: Element): Element {
  let current = element;
  while (isAnonymousInline(current) && current.parentElement && isSelectable(current.parentElement)) {
    current = current.parentElement;
  }
  return current;
}

function isAnonymousInline(element: Element): boolean {
  if (element.id || element.classList.length) return false;
  if (element.getAttribute('data-testid') || element.getAttribute('role')) return false;
  const display = getComputedStyle(element).display;
  return display === 'inline' || display.startsWith('inline ');
}

export function elementLabel(element: Element): string {
  const tag = element.tagName.toLowerCase();
  if (element.id) return `${tag}#${element.id}`;
  const className = [...element.classList].find((name) => !isHashedClass(name));
  if (className) return `${tag}.${className}`;
  return tag;
}
