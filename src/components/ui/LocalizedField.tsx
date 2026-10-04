'use client'

import { useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { CircleAlert } from 'lucide-react'
import { useLocale, useTranslations, type Locale } from 'next-intl'
import { localeDirection, routing } from '@/i18n/routing'
import { cn } from '@/utils'
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
  const popover = useRef<HTMLDivElement>(null)
  const popoverId = useId()
  const anchorName = `--locale-${popoverId.replace(/[^a-zA-Z0-9-]/g, '')}`

  const others = routing.locales.filter((locale) => locale !== active)
  const isMissing = (locale: Locale) => !value[locale].trim()
  const activeError = errors[active]
  const otherError = others.find((locale) => errors[locale])
  const flagged = others.some((locale) => errors[locale] || isMissing(locale))
  const messageId = `${id}-message`
  const message = activeError ?? (otherError ? t('otherError', { language: t(`names.${otherError}`), error: errors[otherError]! }) : hint)

  const update = (text: string) => onChange({ ...value, [active]: text })

  const switchTo = (locale: Locale) => {
    setActive(locale)
    popover.current?.hidePopover()
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

        <button
          type="button"
          popoverTarget={popoverId}
          style={{ anchorName } as CSSProperties}
          className={cn(
            'absolute end-1.5 top-1.5 inline-flex h-8 items-center gap-1.5 rounded-sm border border-line px-2 font-mono text-code text-ink-muted',
            'transition-colors hover:border-line-strong hover:bg-surface-raised hover:text-ink',
          )}
        >
          {active.toUpperCase()}
          <span className="sr-only">
            {t('switch', { language: t(`names.${active}`) })}
            {flagged && ` ${t('otherNeedsWork')}`}
          </span>
          {flagged && (
            <span
              aria-hidden
              className={cn('size-1.5 rounded-full', others.some((locale) => errors[locale]) ? 'bg-danger' : 'bg-warning')}
            />
          )}
        </button>

        <div
          ref={popover}
          id={popoverId}
          popover="auto"
          style={{ positionAnchor: anchorName } as CSSProperties}
          className="locale-popover m-0 min-w-56 rounded-lg border border-line bg-surface p-space-2 text-ink shadow-md"
        >
          <ul aria-label={t('languages')} className="grid gap-space-1">
            {others.map((locale) => {
              const missing = isMissing(locale)
              const error = errors[locale]
              return (
                <li key={locale}>
                  <button
                    type="button"
                    onClick={() => switchTo(locale)}
                    className="flex h-11 w-full items-center gap-space-3 rounded-md px-space-3 text-start transition-colors hover:bg-surface-raised"
                  >
                    <span lang={locale} className="text-label text-ink">
                      {t(`names.${locale}`)}
                    </span>
                    <span className="font-mono text-code text-ink-muted">{locale.toUpperCase()}</span>
                    <span
                      className={cn(
                        'ms-auto inline-flex items-center gap-1.5 text-small',
                        error ? 'text-danger' : missing ? 'text-warning' : 'text-ink-muted',
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn('size-1.5 rounded-full', error ? 'bg-danger' : missing ? 'bg-warning' : 'bg-success')}
                      />
                      {error ? t('needsFix') : missing ? t('missing') : t('filled')}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
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
