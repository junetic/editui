const listeners = new Set<() => void>();
const ECHO_MS = 300;
let suppressUntil = 0;

export function onToggle(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitToggle(): void {
  const now = Date.now();
  if (now < suppressUntil) return;
  suppressUntil = now + ECHO_MS;
  for (const listener of listeners) listener();
}
