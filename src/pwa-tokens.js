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
    /* Tactical Telemetry is dark-exclusive; light mirrors dark for OS edge cases */
    light: {
      background: '#0a0a0a',
      theme: '#0a0a0a',
      surface: '#121212',
      accent: '#e61919',
    },
  },
};

export function getThemeColor(isDark = true) {
  return isDark ? PWA_TOKENS.colors.dark.theme : PWA_TOKENS.colors.light.theme;
}
