import './style.css';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { isToggleMessage } from '../../lib/messages';
import { emitToggle } from '../../lib/toggle';

const ISOLATED_EVENTS = [
  'keyup',
  'keydown',
  'keypress',
  'click',
  'mousedown',
  'mouseup',
  'pointerdown',
  'pointerup',
  'wheel',
];

export default defineContentScript({
  matches: ['<all_urls>'],
  allFrames: false,
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'edit-ui',
      position: 'inline',
      anchor: 'html',
      isolateEvents: ISOLATED_EVENTS,
      onMount(container, _shadow, shadowHost) {
        shadowHost.setAttribute('data-editui-root', '');
        for (const [property, value] of [
          ['display', 'block'],
          ['position', 'fixed'],
          ['inset', '0'],
          ['margin', '0'],
          ['pointer-events', 'none'],
          ['z-index', '2147483647'],
          ['background', 'transparent'],
        ] as const) {
          shadowHost.style.setProperty(property, value, 'important');
        }

        const app = document.createElement('div');
        app.id = 'editui-app';
        container.append(app);
        const root = ReactDOM.createRoot(app);
        root.render(<App />);
        return root;
      },
      onRemove(root) {
        root?.unmount();
      },
    });

    ui.mount();

    const onMessage = (message: unknown) => {
      if (isToggleMessage(message)) emitToggle();
    };
    browser.runtime.onMessage.addListener(onMessage);
    ctx.onInvalidated(() => {
      browser.runtime.onMessage.removeListener(onMessage);
      ui.remove();
    });
  },
});
