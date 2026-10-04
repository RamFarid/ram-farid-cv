'use client'

import { useRef, useState, type ReactNode, type RefObject } from 'react'
import { CircleAlert } from 'lucide-react'
import { useLocale, useTranslations, type Locale } from 'next-intl'
import { localeDirection, routing } from '@/i18n/routing'
import { cn } from '@/utils'
import { LocaleSwitch } from './LocaleSwitch'
import { controlClasses } from './TextField'

// One text value per locale behind a single field. It edits the page's locale first; the mono locale code at its end
// opens a native popover with the other languages, each marked filled or missing. See docs/console.md#localized-field

export type LocalizedValue = Record<Locale, string>

type LocalizedFieldProps = {
  label: string
  /** The control's id; each locale's error is looked up by the caller. */
  id: string
  value: LocalizedValue
  onChange: (value: LocalizedValue) => void
  multiline?: boolean
  rows?: number
  maxLength?: number
  hint?: ReactNode
  /** Translated messages per locale ("Add the Arabic text"). */
  errors?: Partial<Record<Locale, string>>
  /** Buttons on the label row that put `text` at the caret, in the language being edited (e.g. a placeholder token). */
  snippets?: { label: string; text: string }[]
  className?: string
}

type Control = HTMLInputElement | HTMLTextAreaElement

export function LocalizedField({
  label,
  id,
  value,
  onChange,
  multiline = false,
  rows = 4,
  maxLength,
  hint,
  errors = {},
  snippets = [],
  className,
}: LocalizedFieldProps) {
  const t = useTranslations('LocalizedField')
  const pageLocale = useLocale()
  const [active, setActive] = useState<Locale>(pageLocale)
  const control = useRef<Control>(null)

  const others = routing.locales.filter((locale) => locale !== active)
  const isMissing = (locale: Locale) => !value[locale].trim()
  const activeError = errors[active]
  const otherError = others.find((locale) => errors[locale])
  const messageId = `${id}-message`
  const message = activeError ?? (otherError ? t('otherError', { language: t(`names.${otherError}`), error: errors[otherError]! }) : hint)

  const update = (text: string) => onChange({ ...value, [active]: text })

  const switchTo = (locale: Locale) => {
    setActive(locale)
    requestAnimationFrame(() => control.current?.focus())
  }

  const insert = (text: string) => {
    const element = control.current
    const current = value[active]
    const start = element?.selectionStart ?? current.length
    const end = element?.selectionEnd ?? current.length
    update(current.slice(0, start) + text + current.slice(end))
    requestAnimationFrame(() => {
      element?.focus()
      element?.setSelectionRange(start + text.length, start + text.length)
    })
  }

  const controlProps = {
    id,
    value: value[active],
    lang: active,
    dir: localeDirection[active],
    maxLength,
    'aria-invalid': activeError ? true : undefined,
    'aria-describedby': message ? messageId : undefined,
    className: cn(controlClasses, 'pe-17'),
  }

  return (
    <div className={cn('grid content-start gap-space-2', className)}>
      <div className="flex min-h-5 flex-wrap items-center justify-between gap-x-space-3 gap-y-space-1">
        <label htmlFor={id} className="text-label text-ink">
          {label}
        </label>
        {snippets.length > 0 && (
          <div className="flex flex-wrap gap-space-1">
            {snippets.map((snippet) => (
              <button
                key={snippet.text}
                type="button"
                onClick={() => insert(snippet.text)}
                className="inline-flex h-7 items-center rounded-sm border border-line px-2 font-mono text-code text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                {snippet.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        {multiline ? (
          <textarea
            ref={control as RefObject<HTMLTextAreaElement>}
            rows={rows}
            onChange={(event) => update(event.target.value)}
            {...controlProps}
            className={cn(controlProps.className, 'block resize-y py-space-3')}
          />
        ) : (
          <input
            ref={control as RefObject<HTMLInputElement>}
            onChange={(event) => update(event.target.value)}
            {...controlProps}
            className={cn(controlProps.className, 'h-11')}
          />
        )}

        <LocaleSwitch
          active={active}
          onSwitch={switchTo}
          isMissing={isMissing}
          errors={errors}
          className="absolute end-1.5 top-1.5"
        />
      </div>

      {message && (
        <p
          id={messageId}
          className={cn(
            'flex items-start gap-space-2 text-small',
            activeError || otherError ? 'text-danger' : 'text-ink-muted',
          )}
        >
          {(activeError || otherError) && <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />}
          <span>
            {message}
            {!activeError && otherError && (
              <>
                {' '}
                <button
                  type="button"
                  onClick={() => switchTo(otherError)}
                  className="text-label text-primary-ink underline underline-offset-4 hover:no-underline"
                >
                  {t('switchShort', { language: t(`names.${otherError}`) })}
                </button>
              </>
            )}
          </span>
        </p>
      )}
    </div>
  )
}
