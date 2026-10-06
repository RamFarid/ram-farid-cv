import { defineRouting } from 'next-intl/routing'

// Routing approach (prefixes, detection): see docs/i18n.md#routing
export const routing = defineRouting({
  // Keep the bare `ar`: CLDR's `ar` formats Western digits, regional tags like `ar-EG` switch to Arabic-Indic. See docs/i18n.md#numbers-and-dates
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // Every page declares its hreflang alternates in the HTML (lib/seo/metadata.ts). The middleware's Link header pointed
  // x-default somewhere else, and two sources disagreeing is worse than one. See docs/seo.md#languages
  alternateLinks: false,
})

export const localeDirection = {
  en: 'ltr',
  ar: 'rtl',
} as const satisfies Record<(typeof routing.locales)[number], 'ltr' | 'rtl'>
