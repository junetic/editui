import { useEffect, useRef, useState } from 'react';
import { copyText } from '../../lib/clipboard';
import { boundsOf, captureElement } from '../../lib/context';
import { fingerprintFor, rematchEdit } from '../../lib/fingerprint';
import { popoverPosition, unionBounds } from '../../lib/geometry';
import { elementAtPoint, elementLabel, isEditUiEvent } from '../../lib/hit-test';
import { rememberBatch, reopenEdit, withoutNote } from '../../lib/history';
import { pageStorageKey, sentStorageKey } from '../../lib/page';
import { formatPrompt } from '../../lib/prompt';
import { loadEdits, loadSent, saveEdits, saveSent } from '../../lib/storage';
import { onToggle } from '../../lib/toggle';
import type { Bounds, Edit, PageContext, SentBatch, ViewportContext } from '../../lib/types';

const UNDO_MS = 6000;
const POPOVER_WIDTH = 300;
const POPOVER_HEIGHT = 180;

export interface MarkerView {
  id: string;
  index: number;
  bounds: Bounds;
  changed: boolean;
  hot: boolean;
  selected: boolean;
}

export interface HoverView {
  label: string;
  bounds: Bounds;
}

interface PromptView {
  title: string;
  placeholder: string;
  submitLabel: string;
  position: { left: number; top: number };
}

export interface EditSession {
  editing: boolean;
  hover: HoverView | null;
  selection: Bounds[];
  selectedBounds: Bounds[];
  markers: MarkerView[];
  prompt: PromptView | null;
  draft: string;
  edits: Edit[];
  history: SentBatch[];
  sidebarOpen: boolean;
  selectedId: string | null;
  selectTick: number;
  selectedPulse: boolean;
  reselecting: boolean;
  copyState: 'idle' | 'copied' | 'error';
  canUndo: boolean;
  saveError: boolean;
  setDraft: (value: string) => void;
  submit: () => void;
  cancel: () => void;
  exit: () => void;
  hoverItem: (id: string | null) => void;
  selectEdit: (id: string) => void;
  copyAll: () => void;
  undoSend: () => void;
  copyEdit: (id: string) => Promise<void>;
  copyNote: (batchId: string, editId: string) => Promise<void>;
  copyBatch: (batchId: string) => void;
  revise: (batchId: string, editId: string, instruction?: string) => string | null;
  forgetNote: (batchId: string, editId: string) => void;
  reselect: (id: string) => void;
  remove: (id: string) => void;
  updateInstruction: (id: string, instruction: string) => void;
}

export function useEditSession(): EditSession {
  const [editing, setEditing] = useState(false);
  const [hover, setHover] = useState<HoverView | null>(null);
  const [selection, setSelection] = useState<Element[]>([]);
  const [promptOpen, setPromptOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [selectTick, setSelectTick] = useState(0);
  const [reselectEditId, setReselectEditId] = useState<string | null>(null);
  const [hotId, setHotId] = useState<string | null>(null);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [history, setHistory] = useState<SentBatch[]>([]);
  const [undoBatch, setUndoBatch] = useState<SentBatch | null>(null);
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [layoutTick, setLayoutTick] = useState(0);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [saveError, setSaveError] = useState(false);
  const [pageKey, setPageKey] = useState(() => pageStorageKey(location.href));

  const live = useRef(new Map<string, Element[]>());
  const saveKey = useRef<string | null>(null);
  const historyKey = useRef<string | null>(null);
  const queue = useRef(Promise.resolve());
  const undoTimer = useRef(0);
  const editingRef = useRef(editing);
  const promptOpenRef = useRef(promptOpen);
  const reselectRef = useRef(reselectEditId);
  const activeRef = useRef(activeEditId);
  const draftRef = useRef(draft);
  const editsRef = useRef(edits);
  const historyRef = useRef(history);
  const selectionRef = useRef(selection);

  editingRef.current = editing;
  promptOpenRef.current = promptOpen;
  reselectRef.current = reselectEditId;
  activeRef.current = activeEditId;
  draftRef.current = draft;
  editsRef.current = edits;
  historyRef.current = history;
  selectionRef.current = selection;

  const actions = useRef({
    cancel: () => {},
    pointerDown: (_event: PointerEvent) => {},
    pointerMove: (_event: PointerEvent) => {},
    keyDown: (_event: KeyboardEvent) => {},
  });

  actions.current.cancel = () => {
    setPromptOpen(false);
    setActiveEditId(null);
    setDraft('');
    setReselectEditId(null);
    selectionRef.current = [];
    setSelection([]);
  };

  actions.current.pointerMove = (event) => {
    if (!editingRef.current || promptOpenRef.current || isEditUiEvent(event)) {
      setHover(null);
      return;
    }
    const target = elementAtPoint(event.clientX, event.clientY);
    if (!target) {
      setHover(null);
      return;
    }
    setHover({ label: elementLabel(target), bounds: boundsOf(target) });
  };

  actions.current.pointerDown = (event) => {
    if (!editingRef.current || event.button !== 0 || isEditUiEvent(event)) return;
    event.preventDefault();
    event.stopPropagation();
    if (promptOpenRef.current) return;

    const target = elementAtPoint(event.clientX, event.clientY);
    if (!target) return;
    const current = selectionRef.current;

    if (event.shiftKey) {
      const next = current.includes(target) ? current.filter((item) => item !== target) : [...current, target];
      selectionRef.current = next;
      setSelection(next);
      if (reselectRef.current) setActiveEditId(reselectRef.current);
      return;
    }

    if (current.length > 0 && current.includes(target)) {
      const editId = reselectRef.current;
      setActiveEditId(editId);
      setDraft(instructionFor(editsRef.current, editId));
      setPromptOpen(true);
      setHover(null);
      return;
    }

    if (reselectRef.current) {
      replaceElements(reselectRef.current, [target]);
      setReselectEditId(null);
      selectionRef.current = [];
      setSelection([]);
      return;
    }

    selectionRef.current = [target];
    setSelection([target]);
    setActiveEditId(null);
    setDraft('');
    setPromptOpen(true);
    setHover(null);
  };

  actions.current.keyDown = (event) => {
    if (!editingRef.current) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (promptOpenRef.current || selectionRef.current.length > 0 || reselectRef.current) {
        actions.current.cancel();
        return;
      }
      setEditing(false);
      return;
    }
    if (event.key !== 'Enter' || event.shiftKey || promptOpenRef.current || isFieldEvent(event)) return;
    if (!selectionRef.current.length) return;
    event.preventDefault();
    event.stopPropagation();
    const editId = reselectRef.current;
    setActiveEditId(editId);
    setDraft(instructionFor(editsRef.current, editId));
    setPromptOpen(true);
    setHover(null);
  };

  function replaceElements(editId: string, elements: Element[]) {
    const captured = elements.map(captureElement);
    setEdits((prev) =>
      prev.map((edit) =>
        edit.id === editId
          ? {
              ...edit,
              elements: captured,
              fingerprints: captured.map(fingerprintFor),
              matchState: 'matched',
              viewport: currentViewport(),
            }
          : edit,
      ),
    );
    live.current.set(editId, elements);
  }

  useEffect(() => onToggle(() => setEditing((current) => !current)), []);

  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  useEffect(() => {
    if (editing) return;
    setPromptOpen(false);
    setHover(null);
    setHotId(null);
    setActiveEditId(null);
    setReselectEditId(null);
    setDraft('');
    selectionRef.current = [];
    setSelection([]);
  }, [editing]);

  useEffect(() => {
    const update = () => {
      const next = pageStorageKey(location.href);
      setPageKey((current) => (current === next ? current : next));
    };
    const id = window.setInterval(update, 400);
    window.addEventListener('popstate', update);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('popstate', update);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    saveKey.current = null;
    historyKey.current = null;
    setUndoBatch(null);
    void Promise.all([loadEdits(pageKey), loadSent(sentStorageKey(location.href))])
      .then(([stored, sent]) => {
        if (cancelled) return;
        live.current.clear();
        const next = stored.map((edit) => {
          const result = rematchEdit(document, edit);
          if (result.state === 'matched') live.current.set(edit.id, result.elements);
          return { ...edit, matchState: result.state };
        });
        saveKey.current = pageKey;
        historyKey.current = sentStorageKey(location.href);
        setEdits(next);
        setHistory(sent);
      })
      .catch(() => {
        if (cancelled) return;
        saveKey.current = pageKey;
        historyKey.current = sentStorageKey(location.href);
      });
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  useEffect(() => {
    const key = saveKey.current;
    if (!key) return;
    const snapshot = edits;
    queue.current = queue.current
      .then(() => saveEdits(key, snapshot))
      .then(() => setSaveError(false))
      .catch(() => setSaveError(true));
  }, [edits]);

  useEffect(() => {
    const key = historyKey.current;
    if (!key) return;
    const snapshot = history;
    queue.current = queue.current.then(() => saveSent(key, snapshot)).catch(() => setSaveError(true));
  }, [history]);

  useEffect(() => {
    void browser.runtime.sendMessage({ type: 'edit-state', editing, count: edits.length }).catch(() => undefined);
  }, [editing, edits.length]);

  useEffect(() => {
    if (!editing) return;
    let moveFrame = 0;
    let layoutFrame = 0;
    let lastMove: PointerEvent | null = null;

    const onPointerMove = (event: PointerEvent) => {
      lastMove = event;
      if (moveFrame) return;
      moveFrame = requestAnimationFrame(() => {
        moveFrame = 0;
        if (lastMove) actions.current.pointerMove(lastMove);
      });
    };
    const onPointerDown = (event: PointerEvent) => actions.current.pointerDown(event);
    const onKeyDown = (event: KeyboardEvent) => actions.current.keyDown(event);
    const swallow = (event: Event) => {
      if (!editingRef.current || isEditUiEvent(event)) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onLayout = () => {
      if (layoutFrame) return;
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = 0;
        setLayoutTick((tick) => tick + 1);
      });
    };

    window.addEventListener('pointermove', onPointerMove, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('mousedown', swallow, true);
    window.addEventListener('click', swallow, true);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('scroll', onLayout, true);
    window.addEventListener('resize', onLayout);
    return () => {
      window.removeEventListener('pointermove', onPointerMove, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('mousedown', swallow, true);
      window.removeEventListener('click', swallow, true);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('scroll', onLayout, true);
      window.removeEventListener('resize', onLayout);
      cancelAnimationFrame(moveFrame);
      cancelAnimationFrame(layoutFrame);
    };
  }, [editing]);

  void layoutTick;

  const selectionBounds = selection.filter((element) => element.isConnected).map((element) => boundsOf(element));
  const anchor = unionBounds(selectionBounds);
  const prompt =
    promptOpen && anchor
      ? {
          title: selection.length > 1 ? `${selection.length} elements selected` : 'Edit this',
          placeholder: selection.length > 1 ? 'Make all three equal height...' : 'Make this heading smaller...',
          submitLabel: activeEditId ? 'Save' : 'Add',
          position: popoverPosition(anchor, { width: POPOVER_WIDTH, height: POPOVER_HEIGHT }, currentViewport()),
        }
      : null;

  const markers: MarkerView[] = edits.flatMap((edit, index) => {
    const boxes = boundsFor(edit, live.current);
    const bounds = unionBounds(boxes);
    if (!bounds || bounds.width < 4 || bounds.height < 4) return [];
    const nodes = live.current.get(edit.id)?.filter((element) => element.isConnected) ?? [];
    return [
      {
        id: edit.id,
        index,
        bounds,
        changed: edit.matchState !== 'matched' || nodes.length !== edit.elements.length,
        hot: hotId === edit.id,
        selected: activeEditId === edit.id && !promptOpen,
      },
    ];
  });
  const selectedEdit = edits.find((edit) => edit.id === activeEditId && !promptOpen) ?? null;
  const selectedBounds = selectedEdit ? boundsFor(selectedEdit, live.current) : [];

  function submit() {
    const instruction = draftRef.current.trim();
    const elements = selectionRef.current.filter((element) => element.isConnected);
    if (!instruction || !elements.length) return;
    const captured = elements.map(captureElement);
    const fingerprints = captured.map(fingerprintFor);
    const editId = activeRef.current;
    let selectedId = editId;
    if (editId && editsRef.current.some((edit) => edit.id === editId)) {
      setEdits((prev) =>
        prev.map((edit) =>
          edit.id === editId
            ? { ...edit, instruction, elements: captured, fingerprints, matchState: 'matched', viewport: currentViewport() }
            : edit,
        ),
      );
      live.current.set(editId, elements);
    } else {
      selectedId = `edit_${crypto.randomUUID()}`;
      const edit: Edit = {
        id: selectedId,
        instruction,
        createdAt: Date.now(),
        page: currentPage(),
        viewport: currentViewport(),
        elements: captured,
        fingerprints,
        matchState: 'matched',
      };
      live.current.set(edit.id, elements);
      setEdits((prev) => [...prev, edit]);
    }
    actions.current.cancel();
    setActiveEditId(selectedId);
  }

  function forgetNote(batchId: string, editId: string) {
    setHistory((prev) => withoutNote(prev, batchId, editId));
    setUndoBatch((current) => {
      if (!current || current.id !== batchId) return current;
      return withoutNote([current], batchId, editId)[0] ?? null;
    });
  }

  function remove(id: string) {
    setEdits((prev) => prev.filter((edit) => edit.id !== id));
    live.current.delete(id);
    if (activeRef.current === id || reselectRef.current === id) actions.current.cancel();
  }

  function selectEdit(id: string) {
    const edit = editsRef.current.find((item) => item.id === id);
    if (!edit) return;
    setActiveEditId(id);
    setSelectTick((tick) => tick + 1);
    setPromptOpen(false);
    setDraft('');
    setReselectEditId(null);
    selectionRef.current = [];
    setSelection([]);
    const node = live.current.get(id)?.find((element) => element.isConnected);
    node?.scrollIntoView({ block: 'center', inline: 'nearest' });
    setPulseId(id);
    window.setTimeout(() => setPulseId((current) => (current === id ? null : current)), 1200);
    setHover(null);
  }

  return {
    editing,
    hover: editing && !promptOpen ? hover : null,
    selection: selectionBounds,
    selectedBounds,
    markers: editing ? markers : [],
    prompt: editing ? prompt : null,
    draft,
    edits,
    history,
    sidebarOpen: editing && (edits.length > 0 || history.length > 0 || undoBatch !== null),
    selectedId: promptOpen ? null : activeEditId,
    selectTick,
    selectedPulse: pulseId === activeEditId && !promptOpen,
    reselecting: editing && reselectEditId !== null,
    copyState,
    canUndo: undoBatch !== null,
    saveError,
    setDraft,
    submit,
    cancel: () => actions.current.cancel(),
    exit: () => setEditing(false),
    hoverItem: setHotId,
    selectEdit,
    copyAll: () => {
      const snapshot = withLiveBounds(editsRef.current, live.current);
      if (!snapshot.length) return;
      const page = currentPage();
      const viewport = currentViewport();
      const prompt = formatPrompt(snapshot, page, viewport);
      void copyText(prompt)
        .then(() => {
          const batch: SentBatch = {
            id: `sent_${crypto.randomUUID()}`,
            sentAt: Date.now(),
            page,
            viewport,
            edits: snapshot,
            prompt,
          };
          setHistory((prev) => rememberBatch(prev, batch));
          for (const edit of snapshot) live.current.delete(edit.id);
          setEdits([]);
          setActiveEditId(null);
          setHotId(null);
          setUndoBatch(batch);
          setCopyState('copied');
          window.clearTimeout(undoTimer.current);
          undoTimer.current = window.setTimeout(() => {
            setUndoBatch(null);
            setCopyState('idle');
          }, UNDO_MS);
        })
        .catch(() => setCopyState('error'));
    },
    undoSend: () => {
      if (!undoBatch) return;
      window.clearTimeout(undoTimer.current);
      const batch = undoBatch;
      setUndoBatch(null);
      setCopyState('idle');
      setHistory((prev) => prev.filter((item) => item.id !== batch.id));
      const restored = batch.edits.map((edit) => {
        const result = rematchEdit(document, edit);
        if (result.state === 'matched') live.current.set(edit.id, result.elements);
        return { ...edit, matchState: result.state };
      });
      setEdits((current) => {
        const ids = new Set(current.map((edit) => edit.id));
        return [...restored.filter((edit) => !ids.has(edit.id)), ...current];
      });
    },
    copyEdit: (id) => {
      const [edit] = withLiveBounds(
        editsRef.current.filter((item) => item.id === id),
        live.current,
      );
      if (!edit) return Promise.resolve();
      return copyText(formatPrompt([edit], currentPage(), currentViewport()));
    },
    copyNote: (batchId, editId) => {
      const batch = historyRef.current.find((item) => item.id === batchId);
      const edit = batch?.edits.find((item) => item.id === editId);
      if (!batch || !edit) return Promise.resolve();
      return copyText(formatPrompt([edit], batch.page, batch.viewport));
    },
    copyBatch: (batchId) => {
      const batch = historyRef.current.find((item) => item.id === batchId);
      if (!batch) return;
      void copyText(batch.prompt)
        .then(() => {
          setCopyState('copied');
          window.setTimeout(() => setCopyState('idle'), 1600);
        })
        .catch(() => setCopyState('error'));
    },
    revise: (batchId, editId, instruction) => {
      const source = historyRef.current.find((item) => item.id === batchId)?.edits.find((edit) => edit.id === editId);
      if (!source) return null;
      const edit = reopenEdit(source);
      const result = rematchEdit(document, edit);
      if (result.state === 'matched') live.current.set(edit.id, result.elements);
      setEdits((prev) => [...prev, { ...edit, instruction: instruction ?? edit.instruction, matchState: result.state }]);
      forgetNote(batchId, editId);
      setActiveEditId(edit.id);
      return edit.id;
    },
    forgetNote,
    reselect: (id) => {
      setReselectEditId(id);
      setActiveEditId(id);
      setPromptOpen(false);
      selectionRef.current = [];
      setSelection([]);
    },
    remove,
    updateInstruction: (id, instruction) => {
      setEdits((prev) => prev.map((edit) => (edit.id === id ? { ...edit, instruction } : edit)));
    },
  };
}

function boundsFor(edit: Edit, live: Map<string, Element[]>): Bounds[] {
  const nodes = live.get(edit.id)?.filter((element) => element.isConnected) ?? [];
  if (edit.matchState === 'matched' && nodes.length === edit.elements.length) return nodes.map((element) => boundsOf(element));
  return edit.elements.map((element) => element.bounds);
}

function instructionFor(edits: Edit[], id: string | null): string {
  if (!id) return '';
  return edits.find((edit) => edit.id === id)?.instruction ?? '';
}

function currentPage(): PageContext {
  return { url: location.href, pathname: location.pathname, title: document.title };
}

function currentViewport(): ViewportContext {
  return { width: window.innerWidth, height: window.innerHeight };
}

function withLiveBounds(edits: Edit[], live: Map<string, Element[]>): Edit[] {
  return edits.map((edit) => {
    const nodes = live.get(edit.id);
    if (!nodes?.length) return edit;
    return {
      ...edit,
      viewport: currentViewport(),
      elements: edit.elements.map((element, index) => {
        const node = nodes[index];
        return node?.isConnected ? { ...element, bounds: boundsOf(node) } : element;
      }),
    };
  });
}

function isFieldEvent(event: Event): boolean {
  return event.composedPath().some((node) => node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement);
}
