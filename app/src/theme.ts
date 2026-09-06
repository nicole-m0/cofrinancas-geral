/**
 * Design tokens for the "Saldo" app.
 * Ported from the Claude Design project "Finanças Pessoais - App".
 */

export const colors = {
  // Surfaces
  canvas: '#E9E7E2',
  screen: '#FBFAF9',
  card: '#FFFFFF',
  surfaceMuted: '#F1EFEA',
  surfaceSunken: '#F7F5F1',
  surfaceRaised: '#F4F2ED',

  // Hairlines / rings
  ring: '#EDEBE6',
  ringSoft: '#E6E4DF',
  ringStrong: '#DFDCD6',
  divider: '#F1EFEA',

  // Text
  ink: '#101413',
  inkSoft: '#3C423F',
  textSecondary: '#6B7270',
  textMuted: '#8B918F',
  textFaint: '#A2A8A6',

  // Brand green
  green: '#0F7A56',
  greenDark: '#0B5C3F',
  greenBright: '#2FBE86',
  greenLight: '#6FD3A6',
  greenTint: '#E4F1EB',
  greenTintBorder: '#CFE6DB',
  greenInk: '#2E6A55',

  // Expense / negative
  rust: '#C0512F',
  rustBright: '#E5714B',
  rustSoft: '#F2A48A',
  rustTint: '#FBEAE4',

  // Toggle track
  toggleOn: '#0F7A56',
  toggleOff: '#E1DFD9',

  white: '#FFFFFF',
  black: '#101413',
} as const;

/** Category palette — name -> { color, tint } */
export const categoryColors: Record<string, { color: string; tint: string }> = {
  Moradia: { color: '#3E5C76', tint: '#ECF0F4' },
  Mercado: { color: '#0F7A56', tint: '#E4F1EB' },
  Transporte: { color: '#5B5BD6', tint: '#EDEDFB' },
  Delivery: { color: '#C0512F', tint: '#FBEAE4' },
  Lazer: { color: '#C08A2F', tint: '#F7EFDF' },
  'Saúde': { color: '#2E8B8B', tint: '#E6F2F2' },
  Outros: { color: '#9AA0A0', tint: '#EFEFEE' },
  'Salário': { color: '#0F7A56', tint: '#E4F1EB' },
  Freelance: { color: '#3E5C76', tint: '#ECF0F4' },
  Investimentos: { color: '#5B5BD6', tint: '#EDEDFB' },
};

/** Swatch options offered in the "nova categoria" form */
export const swatches = [
  '#3E5C76',
  '#0F7A56',
  '#5B5BD6',
  '#C0512F',
  '#C08A2F',
  '#2E8B8B',
  '#9AA0A0',
] as const;

export const radius = {
  frame: 42,
  xl: 26,
  lg: 24,
  md: 20,
  sm: 16,
  xs: 14,
  tile: 13,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

/** Manrope weights, keyed by the family name registered via useFonts */
export const font = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

export const shadow = {
  card: {
    shadowColor: '#101413',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  fab: {
    shadowColor: '#0F7A56',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;
