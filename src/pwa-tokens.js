/** PWA + browser chrome colors - keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#0e1114',
      theme: '#0e1114',
      surface: '#1a2229',
      accent: '#2dd4bf',
    },
    light: {
      background: '#f5f7f8',
      theme: '#f5f7f8',
      surface: '#e7ecef',
      accent: '#0e6b5c',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
