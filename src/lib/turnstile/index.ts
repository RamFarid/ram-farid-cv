import 'server-only'

// Server-side check of a Turnstile token: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
// See docs/contact.md#turnstile

const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

// Error codes that mean our setup is wrong, not that the visitor failed the check.
const setupErrors = new Set(['missing-input-secret', 'invalid-input-secret', 'internal-error'])

/** `failed`: the visitor didn't pass. `unavailable`: the check couldn't run (missing secret, Cloudflare unreachable). */
export type TurnstileOutcome = 'passed' | 'failed' | 'unavailable'

export async function verifyTurnstile(token: string, ip?: string | null): Promise<TurnstileOutcome> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not set; the contact form cannot accept messages.')
    return 'unavailable'
  }
  // Tokens are at most 2048 characters.
  if (!token || token.length > 2048) return 'failed'

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, ...(ip && { remoteip: ip }) }),
      signal: AbortSignal.timeout(10_000),
    })
    const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] }
    if (result.success) return 'passed'

    const codes = result['error-codes'] ?? []
    if (codes.some((code) => setupErrors.has(code))) {
      console.error('Turnstile verification failed on our side:', codes)
      return 'unavailable'
    }
    return 'failed'
  } catch (error) {
    console.error('Turnstile verification could not run:', error)
    return 'unavailable'
  }
}
