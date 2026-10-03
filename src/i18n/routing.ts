import { defineRouting } from 'next-intl/routing'

// Routing approach (prefixes, detection): see docs/i18n.md#routing
export const routing = defineRouting({
  // Keep the bare `ar`: CLDR's `ar` formats Western digits, regional tags like `ar-EG` switch to Arabic-Indic. See docs/i18n.md#numbers-and-dates
  locales: ['en', 'ar'],
  defaultLocale: 'en',
})

export const localeDirection = {
  en: 'ltr',
  ar: 'rtl',
} as const satisfies Record<(typeof routing.locales)[number], 'ltr' | 'rtl'>
