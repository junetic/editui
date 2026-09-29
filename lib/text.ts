const MAX_TEXT = 240;

export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export function visibleText(element: Element): string {
  const raw = element.textContent ?? '';
  return truncate(collapseWhitespace(raw), MAX_TEXT);
}
