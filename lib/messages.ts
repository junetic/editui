export interface ToggleMessage {
  type: 'toggle-edit-mode';
}

export interface EditStateMessage {
  type: 'edit-state';
  editing: boolean;
  count: number;
}

export function isToggleMessage(value: unknown): value is ToggleMessage {
  return isRecord(value) && value.type === 'toggle-edit-mode';
}

export function isEditStateMessage(value: unknown): value is EditStateMessage {
  return (
    isRecord(value) &&
    value.type === 'edit-state' &&
    typeof value.editing === 'boolean' &&
    typeof value.count === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
