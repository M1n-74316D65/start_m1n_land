import { PWA_TOKENS } from './src/pwa-tokens.js';

const { dark } = PWA_TOKENS.colors;

export default {
  registerType: 'autoUpdate',
  includeAssets: [
    'favicon.ico',
    'icon.svg',
    'images/favicon-32.png',
    'images/favicon-128.png',
    'images/favicon-192.png',
    'images/favicon-512.png',
  ],
  manifest: {
    id: '/',
    name: PWA_TOKENS.name,
    short_name: PWA_TOKENS.shortName,
    description: PWA_TOKENS.description,
    version: PWA_TOKENS.version,
    start_url: '.',
    scope: '.',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    orientation: 'any',
    background_color: dark.background,
    theme_color: dark.theme,
    categories: ['productivity', 'utilities'],
    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
    icons: [
      {
        src: '/images/favicon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/images/favicon-128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/favicon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/favicon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    navigateFallback: '/offline.html',
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/duckduckgo\.com/,
        handler: 'NetworkOnly',
      },
      {
        urlPattern: /^https:\/\/hn\.algolia\.com/,
        handler: 'NetworkOnly',
      },
    ],
  },
};
