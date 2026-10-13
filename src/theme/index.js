// Design system : toutes les couleurs, tailles et espacements de l'app au même endroit.
// Inspiration : entrepôt (bleu encre + jaune des marquages au sol).
export const colors = {
  ink: '#16233A',
  inkSoft: '#2B3B57',
  signal: '#F5B700',
  signalSoft: '#FFF4D1',
  bg: '#EEF0F3',
  card: '#FFFFFF',
  text: '#16202E',
  textMuted: '#667085',
  border: '#DDE1E7',
  success: '#1F8A4C',
  successBg: '#E3F4EA',
  warning: '#B86E00',
  warningBg: '#FFF1D6',
  danger: '#C8372D',
  dangerBg: '#FCE6E4',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 6, md: 10, lg: 16, pill: 999 };

export const font = {
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  h2: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  small: { fontSize: 13, color: colors.textMuted },
  tiny: { fontSize: 11, color: colors.textMuted },
};
