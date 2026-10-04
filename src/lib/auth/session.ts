import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import type { Locale } from 'next-intl'
import { redirect } from '@/i18n/navigation'
import { findActiveSession } from '@/lib/db/auth'
import { hashSessionToken } from '.'

// The console's data access check. Every console page and every console Server Action calls it: rendering a form only
// on a signed-in page is not a security boundary. See docs/console.md#sign-in

export const SESSION_COOKIE = 'console_session'

/** The signed-in device's session, or null. Deduped per request. */
export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  return findActiveSession(hashSessionToken(token))
})

/** For console pages: sends a signed-out visitor to the sign-in page. */
export async function requireSession(locale: Locale) {
  const session = await getSession()
  if (!session) redirect({ href: '/console/sign-in', locale })
  return session!
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  ;(await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function readSessionToken() {
  return (await cookies()).get(SESSION_COOKIE)?.value
}

export async function clearSessionCookie() {
  ;(await cookies()).delete(SESSION_COOKIE)
}
