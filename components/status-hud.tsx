export function StatusPill() {
  return <div className="status interactive">Click the element to reselect</div>;
}

export function ExitButton({ onExit }: { onExit: () => void }) {
  return (
    <button type="button" className="exit interactive" data-editui="exit" onClick={onExit}>
      Exit (Esc)
    </button>
  );
}
