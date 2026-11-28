export const CONFIG = {
  commandPathDelimiter: '/',
  commandSearchDelimiter: ' ',
  commandCaseSensitive: false,
  defaultSearchTemplate: 'https://kagi.com/search?q={}',
  openLinksInNewTab: false,
  suggestionLimit: 4,
  defaultWorkspace: 'personal',
  workspaceStorageKey: 'm1n-active-workspace',
};

export const COMMANDS = new Map([
  // Personal (alphabetical by name)
  [
    'G',
    { name: 'Gmail', url: 'https://mail.google.com/', workspace: 'personal' },
  ],
  [
    'C',
    {
      name: 'Mistral',
      url: 'https://chat.mistral.ai/work',
      workspace: 'personal',
    },
  ],
  [
    'M',
    {
      name: 'MyMemo',
      url: 'https://app.mymemo.ai/',
      workspace: 'personal',
    },
  ],
  ['D', { name: 'Wire', url: 'https://news.m1n.land/', workspace: 'personal' }],
  [
    'B',
    { name: 'Pastebin', url: 'https://paste.m1n.land/', workspace: 'personal' },
  ],
  [
    'R',
    { name: 'RSS feed', url: 'https://owl.report/', workspace: 'personal' },
  ],
  [
    'T',
    { name: 'Twitch', url: 'https://www.twitch.tv', workspace: 'personal' },
  ],
  [
    'W',
    { name: 'Weather', url: 'https://merrysky.net/', workspace: 'personal' },
  ],
  [
    'Y',
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      searchTemplate: '/results?search_query={}',
      workspace: 'personal',
    },
  ],
  // Dev (alphabetical by name)
  [
    'F',
    {
      name: 'Cloudflare',
      url: 'https://dash.cloudflare.com',
      workspace: 'dev',
    },
  ],
  ['H', { name: 'GitHub', url: 'https://github.com', workspace: 'dev' }],
  ['N', { name: 'Neon', url: 'https://neon.tech', workspace: 'dev' }],
  ['I', { name: 'Pico', url: 'https://pico.sh', workspace: 'dev' }],
  ['S', { name: 'Server', url: 'http://192.168.1.139', workspace: 'dev' }],
  [
    'V',
    { name: 'Vercel', url: 'https://vercel.com/dashboard', workspace: 'dev' },
  ],
]);
