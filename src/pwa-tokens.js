/** PWA + browser chrome colors - keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#171916',
      theme: '#171916',
      surface: '#22251f',
      accent: '#c0d59b',
    },
    light: {
      background: '#f4f4f1',
      theme: '#f4f4f1',
      surface: '#eaeae5',
      accent: '#465c2e',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
