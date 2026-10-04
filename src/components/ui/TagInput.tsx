'use client'

import { useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react'
import { CircleAlert, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils'

// A list of tech names typed as mono tags: Enter or a comma adds one, Backspace in the empty input removes the last,
// and a pasted comma-separated list adds them all. Names stay in Latin script in both languages, so the input is LTR.
type TagInputProps = {
  label: string
  id: string
  value: string[]
  onChange: (value: string[]) => void
  max?: number
  maxLength?: number
  placeholder?: string
  hint?: ReactNode
  error?: string
  className?: string
}

export function TagInput({ label, id, value, onChange, max, maxLength = 40, placeholder, hint, error, className }: TagInputProps) {
  const t = useTranslations('TagInput')
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const full = max !== undefined && value.length >= max
  const message = error ?? hint
  const messageId = `${id}-message`

  const add = (names: string[]) => {
    const next = [...value]
    for (const raw of names) {
      const name = raw.trim().slice(0, maxLength)
      const duplicate = next.some((tag) => tag.toLowerCase() === name.toLowerCase())
      if (name && !duplicate && (max === undefined || next.length < max)) next.push(name)
    }
    if (next.length !== value.length) onChange(next)
    setDraft('')
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
    input.current?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add([draft])
    } else if (event.key === 'Backspace' && !draft && value.length) {
      remove(value.length - 1)
    }
  }

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const text = event.clipboardData.getData('text')
    if (!text.includes(',')) return
    event.preventDefault()
    add(text.split(','))
  }

  return (
    <div className={cn('grid content-start gap-space-2', className)}>
      <div className="flex items-center justify-between gap-space-3">
        <label htmlFor={id} className="text-label text-ink">
          {label}
        </label>
        {max !== undefined && (
          <span className="font-mono text-code text-ink-muted" dir="ltr">
            {value.length} / {max}
          </span>
        )}
      </div>

      {/* Clicking the box's empty space focuses the input, like a native field. */}
      <div
        onClick={(event) => event.target === event.currentTarget && input.current?.focus()}
        className={cn(
          'flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-line-strong bg-surface p-1.5 shadow-sm',
          'transition-colors hover:border-ink-muted has-[input:focus-visible]:border-primary',
          // The input drops its own outline, so the box carries the global focus ring.
          'has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-focus',
          error && 'border-danger ring-1 ring-danger',
        )}
      >
        <ul className="contents">
          {value.map((tag, index) => (
            <li
              key={tag}
              dir="ltr"
              className="inline-flex h-7 items-center gap-1 rounded-sm border border-line bg-surface-raised ps-2.5 pe-1 font-mono text-code leading-none text-ink"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={t('remove', { name: tag })}
                className="inline-flex size-5 items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-line hover:text-ink"
              >
                <X aria-hidden size={14} strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
        <input
          ref={input}
          id={id}
          dir="ltr"
          value={draft}
          disabled={full}
          maxLength={maxLength}
          placeholder={full ? t('full') : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => draft.trim() && add([draft])}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className="h-8 min-w-32 flex-1 bg-transparent px-1.5 font-mono text-code text-ink outline-none placeholder:font-sans placeholder:text-small placeholder:text-ink-muted disabled:cursor-not-allowed"
        />
      </div>

      {message && (
        <p id={messageId} className={cn('flex items-start gap-space-2 text-small', error ? 'text-danger' : 'text-ink-muted')}>
          {error && <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />}
          {message}
        </p>
      )}
    </div>
  )
}
