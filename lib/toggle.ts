const listeners = new Set<() => void>();

export function onToggle(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitToggle(): void {
  for (const listener of listeners) listener();
}
