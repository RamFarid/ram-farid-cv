import type { routing } from './routing'
import type en from '../../messages/en.json'
import type ar from '../../messages/ar.json'

// Types useLocale(), Link locales and every t('...') key against en.json (https://next-intl.dev/docs/workflows/typescript)
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof en
  }
}

// Both bundles must have the same keys; type-checking fails here when one drifts. See docs/i18n.md#messages
type AssertAssignable<T, U extends T> = U
export type ArMatchesEn = AssertAssignable<typeof en, typeof ar>
export type EnMatchesAr = AssertAssignable<typeof ar, typeof en>
