import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { noteLine } from '../lib/history';
import { editTitle } from '../lib/prompt';
import type { Edit, SentBatch } from '../lib/types';
import { markerGlyph } from './markers';

const EDGE = 16;
const PANEL_WIDTH = 320;
const MIN_HEIGHT = 220;
const DEFAULT_HEIGHT = 460;

interface Frame {
  x: number;
  y: number;
  height: number;
}

interface ReviewTrayProps {
  edits: Edit[];
  history: SentBatch[];
  selectedId: string | null;
  selectTick: number;
  copyState: 'idle' | 'copied' | 'error';
  canUndo: boolean;
  saveError: boolean;
  onExit: () => void;
  onHoverItem: (id: string | null) => void;
  onSelect: (id: string) => void;
  onCopy: () => void;
  onUndo: () => void;
  onCopyEdit: (id: string) => Promise<void>;
  onCopyNote: (batchId: string, editId: string) => Promise<void>;
  onCopyBatch: (batchId: string) => void;
  onRevise: (batchId: string, editId: string, instruction?: string) => string | null;
  onForget: (batchId: string, editId: string) => void;
  onReselect: (id: string) => void;
  onDelete: (id: string) => void;
  onInstruction: (id: string, instruction: string) => void;
}

export function ReviewTray(props: ReviewTrayProps) {
  const [frame, setFrame] = useState(initialFrame);
  const [pickedKey, setPickedKey] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  function reopen(batchId: string, editId: string, instruction: string | undefined, keepTyping: boolean) {
    const id = props.onRevise(batchId, editId, instruction);
    if (!id) return;
    setPickedKey(id);
    setFocusId(keepTyping ? id : null);
  }
  const copiedNotes = props.history.flatMap((batch) => batch.edits.map((edit) => ({ batch, edit })));
  const copyAgain = props.edits.length === 0 && props.history.length > 0;
  const copyLabel = props.copyState === 'error' ? "Couldn't copy" : copyAgain ? 'Copy again' : 'Copy all';
  const total = props.edits.length + copiedNotes.length;
  const heading = total === 0 ? 'EditUI' : `EditUI — ${total} ${total === 1 ? 'edit' : 'edits'}`;

  useEffect(() => {
    if (!props.selectedId) return;
    setPickedKey(props.selectedId);
  }, [props.selectTick, props.selectedId]);

  useEffect(() => {
    const clamp = () => setFrame((current) => clampFrame(current));
    window.addEventListener('resize', clamp);
    return () => window.removeEventListener('resize', clamp);
  }, []);

  function onDragStart(event: ReactPointerEvent<HTMLElement>) {
    if (event.button !== 0 || (event.target as Element).closest('button')) return;
    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const origin = frame;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const move = (ev: PointerEvent) => {
      setFrame(clampFrame({ ...origin, x: origin.x + ev.clientX - startX, y: origin.y + ev.clientY - startY }));
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
  }

  function onResizeStart(event: ReactPointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    const startY = event.clientY;
    const origin = frame.height;
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const move = (ev: PointerEvent) => {
      setFrame((current) => clampFrame({ ...current, height: origin + ev.clientY - startY }));
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
  }

  return (
    <aside
      className="tray interactive"
      style={{ left: frame.x, top: frame.y, width: PANEL_WIDTH, height: frame.height }}
      role="dialog"
      aria-label="Edits"
      data-editui="tray"
    >
      <header className="tray-header">
        <div className="tray-heading">
          <div className="tray-grip" data-editui="tray-grip" aria-label="Move panel" onPointerDown={onDragStart}>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <h2>{heading}</h2>
        </div>
        <button type="button" className="ghost" data-editui="exit" onClick={props.onExit}>
          Exit (Esc)
        </button>
      </header>
      <div className="tray-list">
        {total === 0 ? <p className="empty">Click an element to add a note.</p> : null}
        <ol>
          {props.edits.map((edit, index) => (
            <NoteRow
              key={edit.id}
              index={index}
              title={editTitle(edit)}
              instruction={edit.instruction}
              copied={false}
              selected={pickedKey === edit.id || (pickedKey === null && edit.id === props.selectedId)}
              onSelect={() => {
                setPickedKey(edit.id);
                props.onSelect(edit.id);
              }}
              onHover={() => props.onHoverItem(edit.id)}
              onLeave={() => props.onHoverItem(null)}
              onCopy={() => props.onCopyEdit(edit.id)}
              onInstruction={(value) => props.onInstruction(edit.id, value)}
              focusInput={focusId === edit.id}
              changed={edit.matchState === 'changed'}
              menu={[
                { label: 'Reselect', onClick: () => props.onReselect(edit.id) },
                { label: 'Delete', danger: true, testId: 'delete', onClick: () => props.onDelete(edit.id) },
              ]}
            />
          ))}
          {copiedNotes.map(({ batch, edit }, index) => {
            const key = `${batch.id}:${edit.id}`;
            const number = props.edits.length + index;
            return (
              <NoteRow
                key={key}
                index={number}
                title={editTitle(edit)}
                instruction={edit.instruction}
                copied
                selected={pickedKey === key}
                onSelect={() => setPickedKey(key)}
                onHover={() => undefined}
                onLeave={() => undefined}
                onCopy={() => props.onCopyNote(batch.id, edit.id)}
                onInstruction={(value) => reopen(batch.id, edit.id, value, true)}
                focusInput={false}
                changed={false}
                menu={[
                  { label: 'Revise', testId: 'revise', onClick: () => reopen(batch.id, edit.id, undefined, false) },
                  { label: 'Delete', danger: true, testId: 'delete-copied', onClick: () => props.onForget(batch.id, edit.id) },
                ]}
              />
            );
          })}
        </ol>
      </div>
      <footer className="tray-footer">
        {props.saveError ? <p className="changed-copy">Couldn't save edits on this page.</p> : null}
        {props.canUndo ? (
          <button type="button" className="ghost" data-editui="undo" onClick={props.onUndo}>
            Undo
          </button>
        ) : null}
        <button
          type="button"
          className="primary wide"
          data-editui={copyAgain ? 'copy-again' : 'copy-all'}
          onClick={() => {
            if (!copyAgain) {
              props.onCopy();
              return;
            }
            const batch = props.history[0];
            if (batch) props.onCopyBatch(batch.id);
          }}
          disabled={!copyAgain && !props.edits.length}
        >
          {copyAgain ? (
            <span className="btn-check" aria-hidden="true">
              ✓
            </span>
          ) : null}
          {copyLabel}
        </button>
      </footer>
      <div className="tray-resize" data-editui="tray-resize" onPointerDown={onResizeStart} />
    </aside>
  );
}

function NoteRow({
  index,
  title,
  instruction,
  copied,
  selected,
  onSelect,
  onHover,
  onLeave,
  onCopy,
  onInstruction,
  focusInput,
  changed,
  menu,
}: {
  index: number;
  title: string;
  instruction: string;
  copied: boolean;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
  onCopy: () => Promise<void>;
  onInstruction: (value: string) => void;
  focusInput: boolean;
  changed: boolean;
  menu: MenuAction[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyLabel, setCopyLabel] = useState('Copy');
  const rowRef = useRef<HTMLLIElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!selected) setMenuOpen(false);
  }, [selected]);

  useEffect(() => {
    if (selected) rowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  useEffect(() => {
    const node = inputRef.current;
    if (!node || !focusInput) return;
    node.focus();
    node.setSelectionRange(node.value.length, node.value.length);
  }, [focusInput]);

  function copyItem() {
    void onCopy()
      .then(() => {
        setCopyLabel('Copied');
        window.setTimeout(() => setCopyLabel('Copy'), 1600);
      })
      .catch(() => setCopyLabel("Couldn't copy"));
  }

  return (
    <li
      ref={rowRef}
      className={[selected ? 'selected' : '', copied ? 'copied' : ''].filter(Boolean).join(' ') || undefined}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="note-head">
        <button
          type="button"
          className="tray-title"
          aria-pressed={selected}
          data-editui={copied ? 'copied-note' : undefined}
          onClick={onSelect}
        >
          <span className={copied ? 'note-index done' : 'note-index'} aria-label={copied ? 'Copied' : undefined}>
            {copied ? '✓' : markerGlyph(index)}
          </span>
          <span className="note-copy">
            <span className="note-title">{title}</span>
            <span className="note-line">{noteLine(instruction)}</span>
          </span>
        </button>
        {selected ? (
          <button
            type="button"
            className="more"
            data-editui="more"
            aria-label="More actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ⋯
          </button>
        ) : null}
        {selected && menuOpen ? (
          <div className="item-menu" role="menu">
            {menu.map((action) => (
              <button
                key={action.label}
                type="button"
                className={action.danger ? 'ghost danger' : 'ghost'}
                role="menuitem"
                data-editui={action.testId}
                onClick={() => {
                  setMenuOpen(false);
                  action.onClick();
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {selected ? (
        <>
          {changed ? <p className="changed-copy">Element changed</p> : null}
          <textarea
            ref={inputRef}
            aria-label={`Instruction for edit ${index + 1}`}
            data-editui="note-input"
            rows={3}
            maxLength={2000}
            value={instruction}
            onChange={(event) => onInstruction(event.target.value)}
          />
          <button type="button" className="outline-btn wide copy-item" data-editui="copy-item" onClick={copyItem}>
            {copyLabel}
          </button>
        </>
      ) : null}
    </li>
  );
}

interface MenuAction {
  label: string;
  danger?: boolean;
  testId?: string;
  onClick: () => void;
}

function initialFrame(): Frame {
  return clampFrame({
    x: window.innerWidth - PANEL_WIDTH - EDGE,
    y: EDGE,
    height: DEFAULT_HEIGHT,
  });
}

function clampFrame(frame: Frame): Frame {
  const available = Math.max(160, window.innerHeight - EDGE * 2);
  const height = Math.min(Math.max(frame.height, Math.min(MIN_HEIGHT, available)), available);
  const maxX = Math.max(EDGE, window.innerWidth - PANEL_WIDTH - EDGE);
  const maxY = Math.max(EDGE, window.innerHeight - height - EDGE);
  return {
    x: Math.min(Math.max(EDGE, frame.x), maxX),
    y: Math.min(Math.max(EDGE, frame.y), maxY),
    height,
  };
}
