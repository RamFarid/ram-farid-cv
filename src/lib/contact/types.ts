import type { Locale } from 'next-intl'
import type { ContactFieldErrors, ContactInput } from '@/lib/validations/contact'

/** Why a submission failed, a key of `Home.contact.errors.form`. */
export type ContactFormError = 'invalid' | 'verification' | 'unavailable'

/** What the contact Server Action returns. Plain and serializable. */
export type ContactResult = { ok: true } | { ok: false; error: ContactFormError; fieldErrors?: ContactFieldErrors }

/** A stored message, as the notification needs it. */
export type ContactMessage = ContactInput & {
  id: string
  locale: Locale
}
