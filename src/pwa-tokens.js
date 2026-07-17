/** PWA + browser chrome colors - keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#050605',
      theme: '#050605',
      surface: '#0a0b0a',
      accent: '#d4a82b',
    },
    light: {
      background: '#e6e7e6',
      theme: '#e6e7e6',
      surface: '#f0f1f0',
      accent: '#9a7818',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
