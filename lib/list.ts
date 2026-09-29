export function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): T[] {
  const next = index + direction;
  if (index < 0 || next < 0 || next >= items.length) return [...items];
  const copy = [...items];
  const [item] = copy.splice(index, 1);
  if (item === undefined) return [...items];
  copy.splice(next, 0, item);
  return copy;
}
