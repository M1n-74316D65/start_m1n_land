export const CONFIG = {
  commandPathDelimiter: '/',
  commandSearchDelimiter: ' ',
  commandCaseSensitive: false,
  defaultSearchTemplate: 'https://search.brave.com/search?q={}',
  openLinksInNewTab: false,
  suggestionLimit: 4,
  defaultWorkspace: 'personal',
  workspaceStorageKey: 'm1n-active-workspace',
};

export const COMMANDS = new Map([
  // Personal (alphabetical by name)
  ['A', { name: 'Mastodon', url: 'https://social.lol', workspace: 'personal' }],
  [
    'M',
    {
      name: 'Minttr',
      url: 'https://my.minttr.com/',
      workspace: 'personal',
    },
  ],
  [
    'B',
    { name: 'Pastebin', url: 'https://paste.m1n.land/', workspace: 'personal' },
  ],
  [
    'G',
    {
      name: 'Posteo',
      url: 'https://posteo.de/webmail/',
      workspace: 'personal',
    },
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
  ['N', { name: 'Neon', url: 'https://neon.tech', workspace: 'dev' }],
  ['I', { name: 'Pico', url: 'https://pico.sh', workspace: 'dev' }],
  ['S', { name: 'Server', url: 'http://192.168.1.139', workspace: 'dev' }],
  ['H', { name: 'SourceHut', url: 'https://git.sr.ht/', workspace: 'dev' }],
  [
    'V',
    { name: 'Vercel', url: 'https://vercel.com/dashboard', workspace: 'dev' },
  ],
]);
