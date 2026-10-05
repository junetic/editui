import { isEditStateMessage, type ToggleMessage } from '../lib/messages';

export default defineBackground(() => {
  void browser.runtime.getPlatformInfo().then((info) => {
    const shortcut = info.os === 'mac' ? 'cmd+shift+E' : 'Ctrl+Shift+E';
    void browser.action.setTitle({ title: `Toggle EditUI (${shortcut})` });
  });
  browser.action.onClicked.addListener((tab) => {
    void toggleTab(tab.id);
  });

  browser.commands.onCommand.addListener((command) => {
    if (command !== 'toggle-edit-mode') return;
    void browser.tabs.query({ active: true, lastFocusedWindow: true }).then((tabs) => {
      void toggleTab(tabs[0]?.id);
    });
  });

  browser.runtime.onMessage.addListener((message, sender) => {
    if (!isEditStateMessage(message) || sender.tab?.id == null) return;
    const tabId = sender.tab.id;
    if (!message.editing) {
      void browser.action.setBadgeText({ tabId, text: '' });
      return;
    }
    void browser.action.setBadgeText({ tabId, text: message.count > 0 ? String(message.count) : 'ON' });
    void browser.action.setBadgeBackgroundColor({ tabId, color: '#2563eb' });
  });
});

async function toggleTab(tabId: number | undefined): Promise<void> {
  if (tabId == null) return;
  try {
    await browser.tabs.sendMessage(tabId, { type: 'toggle-edit-mode' } satisfies ToggleMessage);
  } catch {
    // Restricted pages never receive the content script.
  }
}
