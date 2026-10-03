'use client'

import { type FormEvent, useEffect, useRef, useState, useTransition } from 'react'
import { CircleAlert, CircleCheck } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Turnstile } from '@/components/Reusable/forms/Turnstile'
import { Button } from '@/components/ui/Button'
import { TextArea, TextField } from '@/components/ui/TextField'
import { sendContactMessage } from '@/lib/contact/actions'
import type { ContactFormError, ContactResult } from '@/lib/contact/types'
import {
  type ContactField,
  type ContactFieldErrors,
  checkContactField,
  contactFieldErrors,
  contactFields,
  contactLimits,
  contactZSchema,
  readContactForm,
} from '@/lib/validations/contact'

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

// The form is checked here for instant feedback and again by the Server Action. See docs/contact.md
export function ContactForm() {
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)
  // Remounts a fresh, empty form after "Send another message".
  const [round, setRound] = useState(0)

  if (sent) {
    return (
      <SentNotice
        {...sent}
        onAgain={() => {
          setSent(null)
          setRound((value) => value + 1)
        }}
      />
    )
  }
  return <MessageForm key={round} onSent={setSent} />
}

type FormError = ContactFormError | 'verifying'

function MessageForm({ onSent }: { onSent: (sent: { name: string; email: string }) => void }) {
  const t = useTranslations('Home.contact')
  const locale = useLocale()
  const [pending, startTransition] = useTransition()
  const [errors, setErrors] = useState<ContactFieldErrors>({})
  const [formError, setFormError] = useState<FormError | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [turnstileRound, setTurnstileRound] = useState(0)
  const [challengeVisible, setChallengeVisible] = useState(false)
  const form = useRef<HTMLFormElement>(null)

  function focusFirstInvalid(fieldErrors: ContactFieldErrors) {
    const first = contactFields.find((field) => fieldErrors[field])
    const element = first && form.current?.elements.namedItem(first)
    if (element instanceof HTMLElement) element.focus()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Submitted by hand, not through <form action>, so React doesn't clear the fields when the server sends back an error.
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const parsed = contactZSchema.safeParse(readContactForm(formData))
    if (!parsed.success) {
      const fieldErrors = contactFieldErrors(parsed.error)
      setErrors(fieldErrors)
      setFormError(null)
      focusFirstInvalid(fieldErrors)
      return
    }
    setErrors({})

    if (!siteKey) console.error('NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set; the contact form cannot be sent.')
    if (!token) {
      setFormError(siteKey ? 'verifying' : 'unavailable')
      return
    }
    formData.set('cf-turnstile-response', token)

    startTransition(async () => {
      const result = await sendContactMessage(locale, formData).catch((): ContactResult => ({ ok: false, error: 'unavailable' }))
      if (result.ok) {
        onSent({ name: parsed.data.name, email: parsed.data.email })
        return
      }
      // The token was spent on this attempt, so the next one needs a new check.
      setToken(null)
      setTurnstileRound((value) => value + 1)
      setFormError(result.error)
      if (result.error === 'invalid' && result.fieldErrors) {
        setErrors(result.fieldErrors)
        focusFirstInvalid(result.fieldErrors)
      }
    })
  }

  // Once a field has been flagged, re-check it as it's corrected so the message clears without another submit.
  function recheck(field: ContactField, value: string) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: checkContactField(field, value) }))
  }

  const error = (field: ContactField) => (errors[field] ? t(`errors.${errors[field]}`) : undefined)

  return (
    <form ref={form} noValidate onSubmit={handleSubmit} className="grid gap-space-5" aria-busy={pending}>
      <div className="grid gap-space-5 sm:grid-cols-2">
        <TextField
          name="name"
          label={t('fields.name')}
          autoComplete="name"
          required
          maxLength={contactLimits.name}
          error={error('name')}
          onChange={(event) => recheck('name', event.currentTarget.value)}
        />
        <TextField
          name="email"
          type="email"
          label={t('fields.email')}
          autoComplete="email"
          dir="ltr"
          required
          maxLength={contactLimits.email}
          error={error('email')}
          onChange={(event) => recheck('email', event.currentTarget.value)}
        />
      </div>
      <TextField
        name="phone"
        type="tel"
        label={t('fields.phone')}
        hint={t('fields.phoneHint')}
        autoComplete="tel"
        inputMode="tel"
        dir="ltr"
        maxLength={contactLimits.phone}
        error={error('phone')}
        onChange={(event) => recheck('phone', event.currentTarget.value)}
      />
      <TextArea
        name="message"
        label={t('fields.message')}
        hint={t('fields.messageHint')}
        required
        rows={6}
        maxLength={contactLimits.message}
        error={error('message')}
        onChange={(event) => recheck('message', event.currentTarget.value)}
      />

      {/* No gap here: the widget is zero-height until Cloudflare asks the visitor to click, and only then takes space. */}
      <div>
        {siteKey && (
          <Turnstile
            siteKey={siteKey}
            action="contact"
            language={locale}
            onToken={(value) => {
              setToken(value)
              if (value) setFormError((current) => (current === 'verifying' ? null : current))
            }}
            onVisibleChange={setChallengeVisible}
            resetKey={turnstileRound}
            className={challengeVisible ? 'mb-space-5' : undefined}
          />
        )}

        {formError && (
          <p role="alert" className="mb-space-4 flex items-start gap-space-2 text-small text-danger">
            <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
            {t(`errors.form.${formError}`)}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-space-5 gap-y-space-3">
          <Button type="submit" arrow={!pending} disabled={pending}>
            {pending ? t('sending') : t('submit')}
          </Button>
          <p className="text-small text-ink-muted">{t('privacy')}</p>
        </div>
      </div>
    </form>
  )
}

function SentNotice({ name, email, onAgain }: { name: string; email: string; onAgain: () => void }) {
  const t = useTranslations('Home.contact.sent')
  const heading = useRef<HTMLHeadingElement>(null)

  // The form it replaces had focus; move it to the confirmation so it is announced.
  useEffect(() => heading.current?.focus(), [])

  return (
    <div className="grid content-start justify-items-start gap-space-5 rounded-lg border border-line p-space-6 md:p-space-7">
      <CircleCheck aria-hidden size={32} strokeWidth={1.75} />
      <div className="grid gap-space-2">
        <h3 ref={heading} tabIndex={-1} className="text-h3 text-ink focus-visible:outline-none">
          {t('title')}
        </h3>
        <p className="text-body-lg text-ink-muted">
          {t.rich('body', {
            name,
            address: email,
            bdi: (chunks) => <bdi>{chunks}</bdi>,
            email: (chunks) => (
              <bdi dir="ltr" className="font-mono text-code text-ink">
                {chunks}
              </bdi>
            ),
          })}
        </p>
      </div>
      <Button variant="secondary" onClick={onAgain}>
        {t('again')}
      </Button>
    </div>
  )
}
