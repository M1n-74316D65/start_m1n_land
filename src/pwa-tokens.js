/** PWA + browser chrome colors - keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#0a0a0a',
      theme: '#0a0a0a',
      surface: '#121212',
      accent: '#e61919',
    },
    /* Swiss Industrial Print (Light) palette */
    light: {
      background: '#f4f4f0',
      theme: '#f4f4f0',
      surface: '#eae8e3',
      accent: '#e61919',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
