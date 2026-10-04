'use client'

import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

// One console section: a sticky header (home-page index, name, status, Discard, Save) over its fields. Save is the
// view's one violet control only while the section has unsaved edits. See docs/console.md#saving
type SectionPanelProps = {
  id: string
  /** The section's index on the home page ("02"), so each panel maps to what it edits. None for site-wide settings. */
  index?: string
  title: string
  description: ReactNode
  dirty: boolean
  pending: boolean
  onSave: () => void
  onDiscard: () => void
  children: ReactNode
}

export function SectionPanel({ id, index, title, description, dirty, pending, onSave, onDiscard, children }: SectionPanelProps) {
  const t = useTranslations('Console.save')

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="console-section border-t border-line first:border-t-0">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-space-4 gap-y-space-2 border-b border-line bg-bg py-space-4">
        <h2 id={`${id}-title`} className="flex items-baseline gap-space-3 text-h3 text-ink">
          {index && <span className="font-mono text-code text-ink-muted">{index}</span>}
          {title}
        </h2>

        <div className="ms-auto flex items-center gap-space-3">
          <p aria-live="polite" className="text-small text-ink-muted">
            {pending ? (
              <span className="inline-flex items-center gap-space-2">
                <LoaderCircle aria-hidden size={16} strokeWidth={1.75} className="animate-spin motion-reduce:animate-none" />
                {t('saving')}
              </span>
            ) : dirty ? (
              <span className="inline-flex items-center gap-space-2 text-warning">
                <span aria-hidden className="size-1.5 rounded-full bg-warning" />
                {t('unsaved')}
              </span>
            ) : null}
          </p>
          <Button variant="quiet" size="sm" disabled={!dirty || pending} onClick={onDiscard}>
            {t('discard')}
          </Button>
          <Button variant={dirty ? 'primary' : 'secondary'} size="sm" disabled={!dirty || pending} onClick={onSave}>
            {t('save')}
          </Button>
        </div>
      </header>

      <div className="grid gap-space-6 py-space-6">
        <p className="max-w-measure text-body text-ink-muted">{description}</p>
        {children}
      </div>
    </section>
  )
}
