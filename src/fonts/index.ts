import localFont from 'next/font/local'

// Font stack order and fallback choices: see docs/design-system.md#fonts

// Claims only Arabic code points (unicode-range), so it can lead the stack without catching Latin text.
// No metric fallback: an Arial fallback here would sit ahead of Readex Latin and render Latin text in Arial.
export const readexArabic = localFont({
  src: './ReadexPro-Arabic-Variable.woff2',
  weight: '160 700',
  variable: '--font-readex-arabic',
  adjustFontFallback: false,
  declarations: [
    {
      prop: 'unicode-range',
      value: 'U+0600-06FF, U+0750-077F, U+0870-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFF',
    },
  ],
})

export const readexLatin = localFont({
  src: './ReadexPro-Latin-Variable.woff2',
  weight: '160 700',
  variable: '--font-readex-latin',
})

// A metric-adjusted Arial is a poor stand-in for a monospace face; fall back to the system mono instead.
export const jetbrainsMono = localFont({
  src: './JetBrainsMono-Latin-Variable.woff2',
  weight: '100 800',
  variable: '--font-jetbrains-mono',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'monospace'],
})

export const fontVariables = [readexArabic.variable, readexLatin.variable, jetbrainsMono.variable].join(' ')
