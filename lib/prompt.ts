import { isHashedClass } from './classes';
import { truncate } from './text';
import type { Edit, ElementContext, PageContext, ViewportContext } from './types';

export function editTitle(edit: Edit): string {
  if (edit.elements.length > 1) return `${edit.elements.length} elements`;
  const element = edit.elements[0];
  if (!element) return 'Element';
  const aria = element.attributes['aria-label'];
  if (aria) return truncate(aria, 48);
  if (element.text) return truncate(element.text, 48);
  if (element.id) return element.id;
  const className = element.classes.find((name) => !isHashedClass(name));
  if (className) return `${element.tag}.${className}`;
  return element.tag;
}

export function formatPrompt(edits: Edit[], page: PageContext, viewport: ViewportContext): string {
  if (!edits.length) return '';
  const noun = edits.length === 1 ? 'change' : 'changes';
  const lines = [
    'I reviewed the UI at:',
    '',
    `\`${page.url}\``,
    '',
    `Viewport: ${viewport.width}×${viewport.height}`,
    '',
    `Please implement the following ${edits.length} UI ${noun} while preserving the existing design system and responsive behavior.`,
    '',
  ];

  edits.forEach((edit, index) => {
    lines.push(`## Edit ${index + 1} — ${editTitle(edit)}`, '', '**Request:**', edit.instruction, '');
    edit.elements.forEach((element, elementIndex) => {
      const label = edit.elements.length > 1 ? `Selected element ${elementIndex + 1}` : 'Selected element';
      lines.push(`**${label}:**`, `\`${openingTag(element)}\``, '');
      if (element.text) lines.push('**Text:**', element.text, '');
      lines.push('**Bounds:**', formatBounds(element), '');
      lines.push('**DOM context:**', domContext(element), '');
    });
  });

  lines.push('Implement all requested changes, then review the resulting page against each edit.');
  return lines.join('\n');
}

function openingTag(element: ElementContext): string {
  const parts: string[] = [];
  if (element.id) parts.push(`id="${element.id}"`);
  const classes = element.classes.filter((name) => !isHashedClass(name)).slice(0, 8);
  if (classes.length) parts.push(`class="${classes.join(' ')}"`);
  const attrs = parts.length ? ` ${parts.join(' ')}` : '';
  return `<${element.tag}${attrs}>`;
}

function formatBounds(element: ElementContext): string {
  const { x, y, width, height } = element.bounds;
  return `${Math.round(x)}, ${Math.round(y)}, ${Math.round(width)}×${Math.round(height)}`;
}

function domContext(element: ElementContext): string {
  const styles = Object.entries(element.computedStyles)
    .map(([name, value]) => `${name}: ${value}`)
    .join('; ');
  return [element.parentContext, element.outerHTML, element.siblingContext, styles ? `styles: ${truncate(styles, 400)}` : '']
    .filter(Boolean)
    .join('\n');
}
