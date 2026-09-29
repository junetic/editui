import { describe, expect, it } from 'vitest';
import { popoverPosition, unionBounds } from './geometry';

describe('popoverPosition', () => {
  it('flips above the anchor when the popover would leave the viewport', () => {
    const position = popoverPosition(
      { x: 20, y: 700, width: 120, height: 40 },
      { width: 300, height: 180 },
      { width: 800, height: 760 },
    );
    expect(position.top).toBe(512);
    expect(position.left).toBe(20);
  });

  it('clamps the popover inside the left edge', () => {
    const position = popoverPosition(
      { x: 700, y: 20, width: 80, height: 40 },
      { width: 300, height: 180 },
      { width: 800, height: 900 },
    );
    expect(position.left).toBe(492);
  });
});

describe('unionBounds', () => {
  it('covers every selected box', () => {
    const bounds = unionBounds([
      { x: 10, y: 20, width: 30, height: 40 },
      { x: 50, y: 80, width: 20, height: 10 },
    ]);
    expect(bounds).toEqual({ x: 10, y: 20, width: 60, height: 70 });
  });
});
