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

export type InboxStatus = 'new' | 'read' | 'archived'

/** A stored message as the console shows it. Plain and serializable. */
export type InboxMessage = {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  locale: Locale
  status: InboxStatus
  /** ISO timestamp. */
  receivedAt: string
}

/** What a console message action returns. */
export type InboxActionResult = { ok: true } | { ok: false; error: 'unauthorized' | 'invalid' | 'notFound' | 'unavailable' }
