import { defineConfig } from 'wxt';

export default defineConfig({
  outDir: 'output',
  modules: ['@wxt-dev/module-react'],
  manifest: ({ browser }) => ({
    name: 'EditUI',
    description: 'Point at your UI. Tell your coding agent what to change.',
    permissions: ['storage'],
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'editui@editui.app',
          data_collection_permissions: {
            required: ['none'],
          },
        },
      },
    }),
    action: {
      default_title: 'Toggle EditUI (Ctrl+Shift+E)',
    },
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png',
    },
    commands: {
      'toggle-edit-mode': {
        suggested_key: {
          default: 'Ctrl+Shift+E',
          mac: 'Command+Shift+E',
        },
        description: 'Toggle Edit Mode',
      },
    },
  }),
});
