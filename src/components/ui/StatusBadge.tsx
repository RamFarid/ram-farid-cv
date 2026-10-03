import type { ReactNode } from 'react'
import { cn } from '@/utils'

const tones = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-surface-raised text-ink-muted',
}

type StatusBadgeProps = {
  tone?: keyof typeof tones
  className?: string
  /** Two to four words; the word carries the meaning, the colour is a second signal. */
  children: ReactNode
}

// See docs/design-system/components/StatusBadge/README.md. One per area.
export function StatusBadge({ tone = 'neutral', className, children }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center gap-space-2 rounded-sm ps-2.5 pe-space-3 text-label leading-none',
        tones[tone],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn('size-2 shrink-0 rounded-full bg-current', tone === 'success' && 'motion-safe:animate-status-pulse')}
      />
      {children}
    </span>
  )
}
