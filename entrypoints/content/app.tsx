import { useEffect } from 'react';
import { HoverBox, Outline } from '../../components/hover-box';
import { Markers } from '../../components/markers';
import { PromptPopover } from '../../components/prompt-popover';
import { ReviewTray } from '../../components/review-tray';
import { ExitButton, StatusPill } from '../../components/status-hud';
import { setEditCursor } from '../../lib/edit-cursor';
import { useEditSession } from './use-edit-session';

export function App() {
  const session = useEditSession();

  useEffect(() => {
    setEditCursor(session.editing);
    return () => setEditCursor(false);
  }, [session.editing]);

  if (!session.editing) return null;

  return (
    <>
      <div data-editui="editing" hidden />
      {session.reselecting ? <StatusPill /> : null}
      {session.hover ? <HoverBox bounds={session.hover.bounds} label={session.hover.label} /> : null}
      {session.selection.map((bounds, index) => (
        <Outline key={`${bounds.x}-${bounds.y}-${index}`} bounds={bounds} />
      ))}
      {session.selectedBounds.map((bounds, index) => (
        <Outline key={`selected-${bounds.x}-${bounds.y}-${index}`} bounds={bounds} pulsed={session.selectedPulse} selected />
      ))}
      <Markers markers={session.markers} onOpen={session.selectEdit} />
      {session.prompt ? (
        <PromptPopover
          key={session.promptEpoch}
          title={session.prompt.title}
          placeholder={session.prompt.placeholder}
          value={session.draft}
          submitLabel={session.prompt.submitLabel}
          position={session.prompt.position}
          onChange={session.setDraft}
          onSubmit={session.submit}
          onCancel={session.cancel}
          onCopy={session.copyPrompt}
        />
      ) : null}
      {session.sidebarOpen ? (
        <ReviewTray
          edits={session.edits}
          history={session.history}
          selectedId={session.selectedId}
          selectTick={session.selectTick}
          copyState={session.copyState}
          canUndo={session.canUndo}
          saveError={session.saveError}
          onExit={session.exit}
          onHoverItem={session.hoverItem}
          onSelect={session.selectEdit}
          onCopy={session.copyAll}
          onUndo={session.undoSend}
          onCopyEdit={session.copyEdit}
          onCopyNote={session.copyNote}
          onCopyBatch={session.copyBatch}
          onRevise={session.revise}
          onForget={session.forgetNote}
          onReselect={session.reselect}
          onDelete={session.remove}
          onInstruction={session.updateInstruction}
        />
      ) : (
        <ExitButton onExit={session.exit} />
      )}
    </>
  );
}
