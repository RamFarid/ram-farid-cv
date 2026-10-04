'use client'

import { useId, useRef, type CSSProperties } from 'react'
import { useTranslations, type Locale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { cn } from '@/utils'

// The mono locale code at the end of a multi-language field. It opens a native popover anchored to itself with the
// other languages, each marked filled, missing or needing a fix. See docs/console.md#localized-field

type LocaleSwitchProps = {
  active: Locale
  onSwitch: (locale: Locale) => void
  isMissing: (locale: Locale) => boolean
  /** Translated messages per locale. */
  errors?: Partial<Record<Locale, string>>
  className?: string
}

export function LocaleSwitch({ active, onSwitch, isMissing, errors = {}, className }: LocaleSwitchProps) {
  const t = useTranslations('LocalizedField')
  const popover = useRef<HTMLDivElement>(null)
  const popoverId = useId()
  const anchorName = `--locale-${popoverId.replace(/[^a-zA-Z0-9-]/g, '')}`
  const others = routing.locales.filter((locale) => locale !== active)
  const flagged = others.some((locale) => errors[locale] || isMissing(locale))

  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        style={{ anchorName } as CSSProperties}
        className={cn(
          'inline-flex h-8 items-center gap-1.5 rounded-sm border border-line px-2 font-mono text-code text-ink-muted',
          'transition-colors hover:border-line-strong hover:bg-surface-raised hover:text-ink',
          className,
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
                  onClick={() => {
                    popover.current?.hidePopover()
                    onSwitch(locale)
                  }}
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
    </>
  )
}
