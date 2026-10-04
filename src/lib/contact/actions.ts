'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { verifyTurnstile } from '@/lib/turnstile'
import { contactFieldErrors, contactZSchema, readContactForm } from '@/lib/validations/contact'
import { deleteInboxMessage, notifyContactMessage, saveContactMessage, setInboxStatus } from '.'
import type { ContactResult, InboxActionResult, InboxStatus } from './types'

/**
 * The contact form's mutation boundary: validate, check Turnstile, save, then notify Telegram after the response is sent.
 * `locale` is bound by the form, because root params aren't readable in a Server Action. See docs/contact.md#server-action
 */
export async function sendContactMessage(locale: string, formData: FormData): Promise<ContactResult> {
  const parsed = contactZSchema.safeParse(readContactForm(formData))
  if (!parsed.success || !hasLocale(routing.locales, locale)) {
    return { ok: false, error: 'invalid', fieldErrors: parsed.success ? undefined : contactFieldErrors(parsed.error) }
  }

  const token = formData.get('cf-turnstile-response')
  const requestHeaders = await headers()
  // Cloudflare sits in front of the origin, so the visitor's address is in CF-Connecting-IP.
  const ip = requestHeaders.get('cf-connecting-ip') ?? requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  const turnstile = await verifyTurnstile(typeof token === 'string' ? token : '', ip)
  if (turnstile !== 'passed') return { ok: false, error: turnstile === 'failed' ? 'verification' : 'unavailable' }

  try {
    const message = await saveContactMessage(parsed.data, locale)
    // The message is safe in the database; a Telegram failure is logged, never shown to the visitor.
    after(() =>
      notifyContactMessage(message).catch((error: unknown) =>
        console.error(`Telegram notification failed for contact message ${message.id}:`, error),
      ),
    )
    return { ok: true }
  } catch (error) {
    console.error('Saving a contact message failed:', error)
    return { ok: false, error: 'unavailable' }
  }
}

// The console's inbox actions. Each checks the session; the rail's count and the list re-render through revalidation.
// See docs/console.md#messages

const inboxStatuses: InboxStatus[] = ['new', 'read', 'archived']

async function inboxAction(run: () => Promise<boolean>): Promise<InboxActionResult> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }
  try {
    if (!(await run())) return { ok: false, error: 'notFound' }
  } catch (error) {
    console.error('A console message action failed:', error)
    return { ok: false, error: 'unavailable' }
  }
  revalidatePath('/[locale]/console', 'layout')
  return { ok: true }
}

export async function setMessageStatus(id: string, status: InboxStatus): Promise<InboxActionResult> {
  if (typeof id !== 'string' || !inboxStatuses.includes(status)) return { ok: false, error: 'invalid' }
  return inboxAction(() => setInboxStatus(id, status))
}

/** Permanent. Only archived messages can be deleted. */
export async function deleteMessage(id: string): Promise<InboxActionResult> {
  if (typeof id !== 'string') return { ok: false, error: 'invalid' }
  return inboxAction(() => deleteInboxMessage(id))
}
