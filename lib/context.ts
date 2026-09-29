import { isHashedClass } from './classes';
import { buildSelector } from './selector';
import { collapseWhitespace, truncate, visibleText } from './text';
import type { Bounds, ElementContext } from './types';

const ALLOWED_ATTRIBUTES = [
  'id',
  'class',
  'role',
  'href',
  'type',
  'name',
  'placeholder',
  'aria-label',
  'aria-labelledby',
  'data-testid',
  'alt',
  'title',
];

const STYLE_PROPERTIES = [
  'display',
  'position',
  'font-size',
  'font-weight',
  'line-height',
  'color',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'gap',
  'row-gap',
  'column-gap',
  'flex-direction',
  'align-items',
  'justify-content',
  'grid-template-columns',
];

const MAX_HTML = 1500;
const MAX_DEPTH = 3;
const MAX_CHILDREN = 4;
const MAX_CLASSES = 40;

export function boundsOf(element: Element): Bounds {
  const rect = element.getBoundingClientRect();
  return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
}

export function captureElement(element: Element): ElementContext {
  const classes = [...element.classList].slice(0, MAX_CLASSES);
  return {
    tag: element.tagName.toLowerCase(),
    text: visibleText(element),
    id: element.id || null,
    classes,
    attributes: readAttributes(element),
    selector: buildSelector(element),
    outerHTML: compactOuterHTML(element),
    parentContext: parentOpening(element),
    siblingContext: siblingSummary(element),
    computedStyles: readStyles(element),
    bounds: boundsOf(element),
    role: element.getAttribute('role'),
  };
}

export function compactOuterHTML(element: Element): string {
  return truncate(compactNode(element, MAX_DEPTH), MAX_HTML);
}

function readAttributes(element: Element): Record<string, string> {
  const attributes: Record<string, string> = {};
  for (const name of ALLOWED_ATTRIBUTES) {
    if (name === 'class' || name === 'id') continue;
    const value = cleanAttribute(name, element.getAttribute(name));
    if (value) attributes[name] = value;
  }
  return attributes;
}

function cleanAttribute(name: string, value: string | null): string {
  if (!value) return '';
  if (name === 'href' && (value.startsWith('javascript:') || value.length > 120)) return '';
  return truncate(value, 120);
}

function readStyles(element: Element): Record<string, string> {
  const styles = getComputedStyle(element);
  const result: Record<string, string> = {};
  for (const property of STYLE_PROPERTIES) {
    const value = styles.getPropertyValue(property).trim();
    if (!value || value === 'auto' || value === 'normal' || value === 'none') continue;
    result[property] = value;
  }
  return result;
}

function parentOpening(element: Element): string {
  const parent = element.parentElement;
  if (!parent || parent === document.body || parent === document.documentElement) return '';
  return `<${parent.tagName.toLowerCase()}${attributeText(parent)}>`;
}

function siblingSummary(element: Element): string {
  const before = summarize(element.previousElementSibling);
  const after = summarize(element.nextElementSibling);
  return [before ? `before: ${before}` : '', after ? `after: ${after}` : ''].filter(Boolean).join('\n');
}

function summarize(element: Element | null): string {
  if (!element) return '';
  const text = truncate(collapseWhitespace(element.textContent ?? ''), 80);
  return `<${element.tagName.toLowerCase()}${attributeText(element)}>${text}`;
}

function compactNode(element: Element, depth: number): string {
  const tag = element.tagName.toLowerCase();
  const attrs = attributeText(element);
  if (depth <= 0) return `<${tag}${attrs}>…</${tag}>`;
  const children = [...element.children].slice(0, MAX_CHILDREN);
  const hiddenCount = element.children.length - children.length;
  const inner = [
    directText(element),
    ...children.map((child) => compactNode(child, depth - 1)),
    hiddenCount > 0 ? '…' : '',
  ]
    .filter(Boolean)
    .join('');
  return `<${tag}${attrs}>${inner}</${tag}>`;
}

function directText(element: Element): string {
  let text = '';
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent ?? '';
  }
  return escapeText(truncate(collapseWhitespace(text), 80));
}

function attributeText(element: Element): string {
  const parts: string[] = [];
  for (const name of ALLOWED_ATTRIBUTES) {
    if (name === 'class') {
      const classes = [...element.classList].filter((item) => !isHashedClass(item)).slice(0, 12);
      if (classes.length) parts.push(`class="${escapeAttr(classes.join(' '))}"`);
      continue;
    }
    const value = cleanAttribute(name, element.getAttribute(name));
    if (!value) continue;
    parts.push(`${name}="${escapeAttr(value)}"`);
  }
  return parts.length ? ` ${parts.join(' ')}` : '';
}

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}
