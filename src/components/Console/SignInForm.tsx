'use client'

import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react'
import { CircleAlert, Send } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { sendSignInCode, signIn } from '@/lib/auth/actions'

// Two steps on one card: send a code to Telegram, then type it. A successful sign-in redirects from the action.
// See docs/console.md#sign-in

type Problem =
  | { kind: 'cooldown' | 'unavailable' | 'invalid' | 'expired' }
  | { kind: 'wrong'; attemptsLeft: number }

/** Seconds until `resendAt`, ticking once a second. */
function useCountdown(resendAt: number | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!resendAt) return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [resendAt])
  return resendAt ? Math.max(0, Math.ceil((resendAt - now) / 1000)) : 0
}

export function SignInForm() {
  const t = useTranslations('Console.signIn')
  const locale = useLocale()
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [resendAt, setResendAt] = useState<number | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [sending, startSending] = useTransition()
  const [checking, startChecking] = useTransition()
  const codeInput = useRef<HTMLInputElement>(null)
  const wait = useCountdown(resendAt)

  const requestCode = () =>
    startSending(async () => {
      setProblem(null)
      const result = await sendSignInCode().catch(() => ({ ok: false as const, error: 'unavailable' as const }))
      if (result.ok || result.error === 'cooldown') {
        setSent(true)
        setResendAt(result.resendAt)
        if (!result.ok) setProblem({ kind: 'cooldown' })
        requestAnimationFrame(() => codeInput.current?.focus())
      } else {
        setProblem({ kind: result.error })
      }
    })

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!/^\d{6}$/.test(code)) return setProblem({ kind: 'invalid' })

    startChecking(async () => {
      setProblem(null)
      const result = await signIn(locale, code).catch(() => ({ ok: false as const, error: 'unavailable' as const }))
      if (result.error === 'wrong') setProblem({ kind: 'wrong', attemptsLeft: result.attemptsLeft })
      else setProblem({ kind: result.error })
      if (result.error === 'expired') setCode('')
    })
  }

  const message = problem
    ? problem.kind === 'wrong'
      ? t('errors.wrong', { count: problem.attemptsLeft })
      : t(`errors.${problem.kind}`)
    : null

  if (!sent) {
    return (
      <div className="grid gap-space-4">
        <Button onClick={requestCode} disabled={sending} icon={<Send aria-hidden size={18} strokeWidth={1.75} className="rtl:-scale-x-100" />}>
          {sending ? t('sending') : t('send')}
        </Button>
        {message && <Problem message={message} />}
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-space-4">
      <TextField
        ref={codeInput}
        label={t('code')}
        name="code"
        hint={problem ? undefined : t('codeHint')}
        error={problem && problem.kind !== 'cooldown' ? (message ?? undefined) : undefined}
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
        inputMode="numeric"
        autoComplete="one-time-code"
        dir="ltr"
        className="[&_input]:text-center [&_input]:font-mono [&_input]:text-h3 [&_input]:tracking-[0.4em]"
      />
      {problem?.kind === 'cooldown' && <Problem message={message!} tone="muted" />}

      <Button type="submit" disabled={checking || code.length !== 6}>
        {checking ? t('checking') : t('submit')}
      </Button>

      <p className="text-center text-small text-ink-muted">
        {wait > 0 ? (
          t('resendIn', { seconds: wait })
        ) : (
          <button
            type="button"
            onClick={requestCode}
            disabled={sending}
            className="text-label text-primary-ink underline underline-offset-4 hover:no-underline disabled:opacity-45"
          >
            {t('resend')}
          </button>
        )}
      </p>
    </form>
  )
}

function Problem({ message, tone = 'danger' }: { message: string; tone?: 'danger' | 'muted' }) {
  return (
    <p role="alert" className={`flex items-start gap-space-2 text-small ${tone === 'danger' ? 'text-danger' : 'text-ink-muted'}`}>
      <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
      {message}
    </p>
  )
}
