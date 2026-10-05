import { useEffect, useRef, useState } from 'react';
import { copyText } from '../lib/clipboard';

interface PromptPopoverProps {
  title: string;
  placeholder: string;
  value: string;
  submitLabel: string;
  position: { left: number; top: number };
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function PromptPopover({
  title,
  placeholder,
  value,
  submitLabel,
  position,
  onChange,
  onSubmit,
  onCancel,
}: PromptPopoverProps) {
  const input = useRef<HTMLTextAreaElement>(null);
  const [copyLabel, setCopyLabel] = useState('Copy');

  useEffect(() => {
    input.current?.focus();
  }, []);

  function copyDraft() {
    const text = value.trim();
    if (!text) return;
    void copyText(text).then(
      () => {
        setCopyLabel('Copied');
        window.setTimeout(() => setCopyLabel('Copy'), 1600);
      },
      () => setCopyLabel("Couldn't copy"),
    );
  }

  return (
    <div
      className="popover interactive"
      style={{ left: position.left, top: position.top }}
      role="dialog"
      aria-label={title}
      data-editui="prompt"
    >
      <div className="popover-header">
        <p className="popover-title">{title}</p>
        <button type="button" className="popover-close" aria-label="Close" onClick={onCancel}>
          <CloseIcon />
        </button>
      </div>
      <textarea
        ref={input}
        data-editui="prompt-input"
        rows={3}
        maxLength={2000}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onCancel();
          }
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="popover-actions">
        <button
          type="button"
          className="outline-btn popover-icon-btn"
          data-editui="prompt-copy"
          onClick={copyDraft}
          disabled={!value.trim()}
        >
          <CopyIcon />
          {copyLabel}
        </button>
        <button type="button" className="primary popover-icon-btn" onClick={onSubmit} disabled={!value.trim()}>
          {submitLabel === 'Add' ? <PlusIcon /> : null}
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 1.5v11M1.5 7h11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="4.5" y="4.5" width="8" height="8" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 4.5V2.9A1.4 1.4 0 0 0 8.1 1.5H2.9A1.4 1.4 0 0 0 1.5 2.9v5.2A1.4 1.4 0 0 0 2.9 9.5H4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
