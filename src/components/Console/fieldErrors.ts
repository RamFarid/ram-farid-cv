'use client'

import { useTranslations, type Locale } from 'next-intl'
import type { FieldErrors } from '@/lib/validations/errors'

/** Translates a section's field errors by path: `one('clientCount')`, or `localized('about.title')` for both locales. */
export function useFieldErrors(errors: FieldErrors) {
  const t = useTranslations('Console.errors')
  const one = (path: string) => (errors[path] ? t(errors[path]) : undefined)
  const localized = (path: string): Partial<Record<Locale, string>> => ({ en: one(`${path}.en`), ar: one(`${path}.ar`) })
  return { one, localized }
}
