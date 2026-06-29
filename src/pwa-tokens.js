/** PWA + browser chrome colors — keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#080909',
      theme: '#080909',
      surface: '#0d0e0e',
      accent: '#7cba5f',
    },
    light: {
      background: '#eceeed',
      theme: '#eceeed',
      surface: '#f5f6f5',
      accent: '#5b943b',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
