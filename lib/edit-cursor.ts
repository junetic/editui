const STYLE_ID = 'editui-cursor-style';

const PENCIL = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" fill="#fff" stroke="#111827" stroke-width="1.6" stroke-linejoin="round"/><path d="m15 5 4 4" fill="none" stroke="#2563eb" stroke-width="1.6" stroke-linecap="round"/></svg>`;

export function setEditCursor(active: boolean): void {
  const root = document.documentElement;
  if (!active) {
    root.classList.remove('editui-cursor');
    document.getElementById(STYLE_ID)?.remove();
    return;
  }
  root.classList.add('editui-cursor');
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  const cursor = `url("data:image/svg+xml,${encodeURIComponent(PENCIL)}") 1 18, crosshair`;
  style.textContent = `html.editui-cursor, html.editui-cursor * { cursor: ${cursor} !important; }`;
  (document.head ?? root).append(style);
}
