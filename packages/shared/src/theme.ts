/**
 * Tokens de design do Kairos. Valores em hex para uso em React Native
 * (que não entende oklch nativamente). Mantém paridade visual com os
 * tokens oklch do CSS em apps/web/src/app/globals.css.
 */

export const colors = {
  background: '#f8f1e3',       // paper cream
  surface: '#f1e8d6',           // surface levemente mais quente
  surface2: '#e8ddc8',          // surface 2 — trilhos
  hairline: '#d6ccb8',          // filetes finos
  ink: '#241d15',               // tinta principal
  inkMuted: '#5a4f40',          // tinta secundária
  inkFaint: '#8d7f68',          // tinta terciária
  terracotta: '#b84e2f',        // acento único
  terracottaSoft: '#c77159',
  ochre: '#c79762',             // acento secundário
  sage: '#6b8a5e',              // sucesso
  destructive: '#c5412a',
  background_dark: '#1a1a1a',   // caso precise inverter
} as const

export const fonts = {
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const
