'use client'

import { useId, useState } from 'react'
import { CircleAlert, Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StackLogo } from '@/components/Reusable/projects/StackTag'
import { controlClasses } from '@/components/ui/TextField'
import { findStackTool, stackGroups, stackTools, type StackId } from '@/lib/projects/stack'
import { cn } from '@/utils'

// Picks a project's tools from lib/projects/stack.ts: the chosen ones first, in the order they'll show, then the
// catalogue by group with a search. See docs/portfolio.md#stack

type StackPickerProps = {
  id: string
  label: string
  value: StackId[]
  onChange: (value: StackId[]) => void
  max: number
  error?: string
}

export function StackPicker({ id, label, value, onChange, max, error }: StackPickerProps) {
  const t = useTranslations('Console.project.stack')
  const [query, setQuery] = useState('')
  const labelId = useId()
  const full = value.length >= max
  const needle = query.trim().toLowerCase()
  const matches = stackTools.filter((tool) => !needle || tool.name.toLowerCase().includes(needle) || tool.id.includes(needle))

  const toggle = (toolId: StackId) =>
    onChange(value.includes(toolId) ? value.filter((item) => item !== toolId) : full ? value : [...value, toolId])

  return (
    <div role="group" aria-labelledby={labelId} className="grid content-start gap-space-3">
      <div className="flex flex-wrap items-baseline justify-between gap-space-2">
        <span id={labelId} className="text-label text-ink">
          {label}
        </span>
        <span dir="ltr" className="font-mono text-code text-ink-muted tabular-nums">
          {value.length} / {max}
        </span>
      </div>

      {value.length > 0 ? (
        <ul aria-label={t('chosen')} className="flex flex-wrap gap-space-2">
          {value.map((toolId) => {
            const tool = findStackTool(toolId)
            if (!tool) return null
            return (
              <li key={toolId}>
                <button
                  type="button"
                  onClick={() => toggle(toolId)}
                  aria-label={t('remove', { name: tool.name })}
                  className="group inline-flex h-8 items-center gap-1.5 rounded-sm border border-line-strong bg-surface-raised ps-2 pe-1.5 font-mono text-code text-ink transition-colors hover:border-danger"
                >
                  <StackLogo tool={tool} />
                  {tool.name}
                  <X aria-hidden size={14} strokeWidth={2} className="text-ink-muted group-hover:text-danger" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-small text-ink-muted">{t('none')}</p>
      )}

      <div className={cn('grid gap-space-3 rounded-md border border-line p-space-3', error && 'border-danger')}>
        <div className="relative">
          <Search aria-hidden size={16} strokeWidth={1.75} className="pointer-events-none absolute start-space-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search')}
            aria-label={t('search')}
            dir="ltr"
            className={cn(controlClasses, 'h-9 ps-9 text-small')}
          />
        </div>

        <div className="grid max-h-72 gap-space-4 overflow-y-auto pe-space-1">
          {stackGroups.map((group) => {
            const tools = matches.filter((tool) => tool.group === group)
            if (tools.length === 0) return null
            return (
              <div key={group} role="group" aria-label={t(`groups.${group}`)} className="grid gap-space-2">
                <p aria-hidden className="text-small text-ink-muted">
                  {t(`groups.${group}`)}
                </p>
                <div className="flex flex-wrap gap-space-2">
                  {tools.map((tool) => {
                    const selected = value.includes(tool.id)
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        aria-pressed={selected}
                        disabled={!selected && full}
                        onClick={() => toggle(tool.id)}
                        className={cn(
                          'inline-flex h-7 items-center gap-1.5 rounded-sm border border-line bg-surface ps-2 pe-2.5 font-mono text-code text-ink-muted transition-colors',
                          'hover:border-line-strong hover:text-ink disabled:cursor-not-allowed disabled:opacity-45',
                          selected && 'border-primary bg-primary-soft text-primary-ink hover:border-primary hover:text-primary-ink',
                        )}
                      >
                        <StackLogo tool={tool} />
                        {tool.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          {matches.length === 0 && <p className="text-small text-ink-muted">{t('noMatch', { query })}</p>}
        </div>
      </div>

      {error ? (
        <p className="flex items-start gap-space-2 text-small text-danger">
          <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
          {error}
        </p>
      ) : (
        <p className="text-small text-ink-muted">{full ? t('full', { max }) : t('hint')}</p>
      )}
    </div>
  )
}
