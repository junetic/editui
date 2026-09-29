export function pageStorageKey(href: string): string {
  const url = new URL(href);
  return `edits:${url.origin}${url.pathname}`;
}

export function sentStorageKey(href: string): string {
  const url = new URL(href);
  return `sent:${url.origin}${url.pathname}`;
}
