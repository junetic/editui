import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    input.current?.focus();
  }, []);

  return (
    <div
      className="popover interactive"
      style={{ left: position.left, top: position.top }}
      role="dialog"
      aria-label={title}
      data-editui="prompt"
    >
      <p className="popover-title">{title}</p>
      <textarea
        ref={input}
        data-editui="prompt-input"
        rows={3}
        maxLength={2000}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="popover-actions">
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="primary" onClick={onSubmit} disabled={!value.trim()}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
