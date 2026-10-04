'use server'

import { headers } from 'next/headers'
import { after } from 'next/server'
import { hasLocale } from 'next-intl'
import { z } from 'zod'
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { endSession, notifySignIn, requestSignInCode, verifySignInCode, type RequestCodeResult } from '.'
import { clearSessionCookie, readSessionToken, setSessionCookie } from './session'

const codeZSchema = z.string().trim().regex(/^\d{6}$/)

export async function sendSignInCode(): Promise<RequestCodeResult> {
  try {
    return await requestSignInCode()
  } catch (error) {
    console.error('Requesting a console sign-in code failed:', error)
    return { ok: false, error: 'unavailable' }
  }
}

export type SignInResult =
  | { ok: false; error: 'invalid' | 'expired' | 'unavailable' }
  | { ok: false; error: 'wrong'; attemptsLeft: number }

/** Checks the code, trusts this device for 14 days, then goes to the console. `locale` is bound by the form. */
export async function signIn(locale: string, code: string): Promise<SignInResult> {
  const parsed = codeZSchema.safeParse(code)
  if (!parsed.success || !hasLocale(routing.locales, locale)) return { ok: false, error: 'invalid' }

  const userAgent = (await headers()).get('user-agent') ?? undefined
  let result
  try {
    result = await verifySignInCode(parsed.data, userAgent)
  } catch (error) {
    console.error('Console sign-in failed:', error)
    return { ok: false, error: 'unavailable' }
  }
  if (!result.ok) return result

  await setSessionCookie(result.token, result.expiresAt)
  after(() => notifySignIn(userAgent).catch((error: unknown) => console.error('Sign-in notice failed:', error)))
  redirect({ href: '/console', locale })
  // redirect() throws; this keeps the return type honest for TypeScript.
  return { ok: false, error: 'unavailable' }
}

export async function signOut(locale: string) {
  const token = await readSessionToken()
  if (token) await endSession(token).catch((error: unknown) => console.error('Ending a console session failed:', error))
  await clearSessionCookie()
  redirect({ href: '/console/sign-in', locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale })
}
