/** PWA + browser chrome colors - keep in sync with src/styles/variables.css */
export const PWA_TOKENS = {
  name: 'M1n Startpage',
  shortName: 'M1n',
  description: 'Minimal browser homepage for power users',
  version: '2.0.0',
  colors: {
    dark: {
      background: '#0f0f0f',
      theme: '#0f0f0f',
      surface: '#161616',
      accent: '#c24a2e',
    },
    light: {
      background: '#f5f3ee',
      theme: '#f5f3ee',
      surface: '#faf8f4',
      accent: '#a83c24',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
