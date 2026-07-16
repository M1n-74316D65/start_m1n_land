/** PWA + browser chrome colors - keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#060706',
      theme: '#060706',
      surface: '#0b0c0b',
      accent: '#d4a82b',
    },
    light: {
      background: '#e7e8e7',
      theme: '#e7e8e7',
      surface: '#f1f2f1',
      accent: '#a07d1a',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
