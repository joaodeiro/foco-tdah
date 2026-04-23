const { colors } = require('@kairos/shared/theme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: colors.background,
        surface: colors.surface,
        'surface-2': colors.surface2,
        hairline: colors.hairline,
        ink: colors.ink,
        'ink-muted': colors.inkMuted,
        'ink-faint': colors.inkFaint,
        terracotta: colors.terracotta,
        'terracotta-soft': colors.terracottaSoft,
        ochre: colors.ochre,
        sage: colors.sage,
        destructive: colors.destructive,
      },
      fontFamily: {
        serif: ['InstrumentSerif_400Regular'],
        'serif-italic': ['InstrumentSerif_400Regular_Italic'],
        sans: ['Inter_400Regular'],
        'sans-medium': ['Inter_500Medium'],
        'sans-semi': ['Inter_600SemiBold'],
        mono: ['JetBrainsMono_400Regular'],
      },
    },
  },
  plugins: [],
}
