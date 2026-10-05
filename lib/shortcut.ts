export interface EditShortcutEvent {
  key: string;
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  repeat: boolean;
}

export function isEditShortcut(event: EditShortcutEvent): boolean {
  if (event.repeat || event.altKey || !event.shiftKey) return false;
  if (event.metaKey === event.ctrlKey) return false;
  return event.code === 'KeyE' || event.key.toLowerCase() === 'e';
}
