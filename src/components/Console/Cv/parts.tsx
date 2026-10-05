'use client'

import type { ReactNode } from 'react'
import type { useFieldErrors } from '@/components/Console/fieldErrors'
import type { CvSources } from '@/lib/cv/types'
import type { CvConfigInput } from '@/lib/validations/cv'
import { cn } from '@/utils'

// Shared pieces of the console's CV page. See docs/cv.md#console

/** What each group of the CV page edits: one draft, changed through `change`. */
export type CvFieldsProps = {
  config: CvConfigInput
  change: (change: (config: CvConfigInput) => CvConfigInput) => void
  fieldError: ReturnType<typeof useFieldErrors>
  sources: CvSources
}

/** One group of the CV page, an anchor in the rail. */
export function CvGroup({ id, title, description, children }: { id: string; title: string; description: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-28 gap-space-6 border-t border-line py-space-7 first:border-t-0">
      <div className="grid max-w-measure gap-space-2">
        <h2 id={`${id}-title`} className="text-h3 text-ink">
          {title}
        </h2>
        <p className="text-body text-ink-muted">{description}</p>
      </div>
      {children}
    </section>
  )
}

/** A chip that turns one thing on or off the CV. */
export function ToggleChip({
  pressed,
  onToggle,
  children,
  mono,
}: {
  pressed: boolean
  onToggle: () => void
  children: ReactNode
  mono?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-8 items-center rounded-sm border px-space-3 text-start transition-colors',
        mono ? 'font-mono text-code' : 'text-small',
        pressed
          ? 'border-primary bg-primary-soft text-primary-ink hover:border-primary-ink'
          : 'border-line text-ink-muted line-through hover:border-line-strong hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}

/** Adds or removes `value` from a list. */
export const toggleIn = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
