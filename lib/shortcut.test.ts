import { describe, expect, it } from 'vitest';
import { isEditShortcut, type EditShortcutEvent } from './shortcut';

function press(overrides: Partial<EditShortcutEvent>): EditShortcutEvent {
  return {
    key: 'E',
    code: 'KeyE',
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    repeat: false,
    ...overrides,
  };
}

describe('isEditShortcut', () => {
  it('matches Command-Shift-E and Ctrl-Shift-E', () => {
    expect(isEditShortcut(press({ metaKey: true, shiftKey: true }))).toBe(true);
    expect(isEditShortcut(press({ ctrlKey: true, shiftKey: true, key: 'e', code: '' }))).toBe(true);
  });

  it('ignores partial chords and key repeat', () => {
    expect(isEditShortcut(press({ metaKey: true }))).toBe(false);
    expect(isEditShortcut(press({ shiftKey: true }))).toBe(false);
    expect(isEditShortcut(press({ metaKey: true, ctrlKey: true, shiftKey: true }))).toBe(false);
    expect(isEditShortcut(press({ metaKey: true, shiftKey: true, altKey: true }))).toBe(false);
    expect(isEditShortcut(press({ metaKey: true, shiftKey: true, repeat: true }))).toBe(false);
    expect(isEditShortcut(press({ metaKey: true, shiftKey: true, key: 'f', code: 'KeyF' }))).toBe(false);
  });
});
