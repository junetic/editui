export function isHashedClass(name: string): boolean {
  if (/^css-[a-z0-9]+$/i.test(name)) return true;
  if (/^sc-[a-zA-Z0-9]/.test(name)) return true;
  if (/^jsx-[a-zA-Z0-9]+$/.test(name)) return true;
  if (/__[A-Za-z0-9]{5,}$/.test(name)) return true;
  if (/^[A-Za-z0-9]{8,}$/.test(name) && /[A-Za-z]/.test(name) && /\d/.test(name)) return true;
  return false;
}

export function isStableId(name: string): boolean {
  if (!name || name.includes(':')) return false;
  if (/^(react|ember|svelte)-/i.test(name)) return false;
  return true;
}
