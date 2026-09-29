import type { Bounds } from './types';

export function unionBounds(boxes: Bounds[]): Bounds | null {
  if (!boxes.length) return null;
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function popoverPosition(
  anchor: Bounds,
  popover: { width: number; height: number },
  viewport: { width: number; height: number },
): { left: number; top: number } {
  const margin = 8;
  let left = anchor.x;
  let top = anchor.y + anchor.height + margin;
  if (top + popover.height > viewport.height - margin) top = anchor.y - popover.height - margin;
  if (top < margin) top = margin;
  if (left + popover.width > viewport.width - margin) left = viewport.width - popover.width - margin;
  if (left < margin) left = margin;
  return { left, top };
}

export function boundsStyle(bounds: Bounds): { left: number; top: number; width: number; height: number } {
  return { left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height };
}
