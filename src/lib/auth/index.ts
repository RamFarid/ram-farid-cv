import 'server-only'
import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto'
import {
  consumeOtp,
  deleteSession,
  findActiveOtp,
  findLatestOtp,
  incrementOtpAttempts,
  insertSession,
  replaceOtp,
} from '@/lib/db/auth'
import { escapeTelegramHtml, sendTelegramMessage } from '@/lib/telegram'
import { getConsoleTelegramConfig } from '@/lib/telegram/config'

// Console sign-in: a one-time code from the Telegram bot, then a trusted device for 14 days. See docs/console.md#sign-in

export const OTP_TTL_MS = 5 * 60 * 1000
export const OTP_RESEND_MS = 60 * 1000
export const OTP_MAX_ATTEMPTS = 5
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

export type RequestCodeResult =
  | { ok: true; resendAt: number }
  | { ok: false; error: 'cooldown'; resendAt: number }
  | { ok: false; error: 'unavailable' }

/** Makes a new six-digit code and sends it to the OTP chat. Any earlier code stops working. */
export async function requestSignInCode(): Promise<RequestCodeResult> {
  const telegram = getConsoleTelegramConfig()
  if (!telegram) {
    console.error('Console sign-in is off: TELEGRAM_BOT_TOKEN or TELEGRAM_OTP_CHAT_ID is not set.')
    return { ok: false, error: 'unavailable' }
  }

  const latest = await findLatestOtp()
  if (latest && Date.now() - latest.createdAt.getTime() < OTP_RESEND_MS) {
    return { ok: false, error: 'cooldown', resendAt: latest.createdAt.getTime() + OTP_RESEND_MS }
  }

  const code = randomInt(0, 1_000_000).toString().padStart(6, '0')
  await replaceOtp(sha256(code), new Date(Date.now() + OTP_TTL_MS))

  try {
    await sendTelegramMessage({
      token: telegram.token,
      chatId: telegram.otpChatId,
      html: `<code>${code}</code> is your console sign-in code.\nIt works once and expires in 5 minutes.`,
    })
  } catch (error) {
    console.error('Sending the console sign-in code failed:', error)
    return { ok: false, error: 'unavailable' }
  }

  return { ok: true, resendAt: Date.now() + OTP_RESEND_MS }
}

export type VerifyCodeResult =
  | { ok: true; token: string; expiresAt: Date }
  | { ok: false; error: 'wrong'; attemptsLeft: number }
  | { ok: false; error: 'expired' }

/** Checks a code against the latest one. A right code is consumed; five wrong guesses burn it. */
export async function verifySignInCode(code: string, userAgent?: string): Promise<VerifyCodeResult> {
  const otp = await findActiveOtp()
  if (!otp || otp.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, error: 'expired' }

  const matches = timingSafeEqual(Buffer.from(sha256(code), 'hex'), Buffer.from(otp.codeHash, 'hex'))
  if (!matches) {
    const attempts = await incrementOtpAttempts(otp._id.toString())
    if (attempts >= OTP_MAX_ATTEMPTS) {
      await consumeOtp(otp._id.toString())
      return { ok: false, error: 'expired' }
    }
    return { ok: false, error: 'wrong', attemptsLeft: OTP_MAX_ATTEMPTS - attempts }
  }

  // Two requests racing with the same code: only the one that deletes it signs in.
  if (!(await consumeOtp(otp._id.toString()))) return { ok: false, error: 'expired' }

  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  await insertSession(sha256(token), expiresAt, userAgent?.slice(0, 300))
  return { ok: true, token, expiresAt }
}

export function hashSessionToken(token: string) {
  return sha256(token)
}

export async function endSession(token: string) {
  await deleteSession(sha256(token))
}

/** Tells the owner chat that a device signed in, so a sign-in Ram didn't make is noticed. */
export async function notifySignIn(userAgent: string | undefined) {
  const telegram = getConsoleTelegramConfig()
  if (!telegram?.ownerChatId) return

  await sendTelegramMessage({
    token: telegram.token,
    chatId: telegram.ownerChatId,
    html: [
      '<b>New console sign-in</b>',
      `Device: ${escapeTelegramHtml(userAgent || 'unknown')}`,
      'Trusted for 14 days.',
    ].join('\n'),
  })
}
