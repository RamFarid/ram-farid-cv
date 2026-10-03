import type { ReactNode } from 'react'
import { cn } from '@/utils'

type TagProps = {
  /** Toggle state; only meaningful with `onClick`. */
  selected?: boolean
  /** Makes the tag a toggle button (filters). Static tags render a span. */
  onClick?: () => void
  className?: string
  children: ReactNode
}

// A mono chip for a technology or skill, written as its project writes it. See docs/design-system/components/Tag/README.md
export function Tag({ selected = false, onClick, className, children }: TagProps) {
  const classes = cn(
    'inline-flex h-7 items-center gap-space-1 rounded-sm border border-line bg-surface px-2.5 font-mono text-code leading-none whitespace-nowrap text-ink-muted',
    selected && 'border-primary bg-primary-soft text-primary-ink',
    className,
  )

  if (!onClick) return <span className={classes}>{children}</span>

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(classes, 'cursor-pointer transition-colors hover:border-line-strong hover:text-ink')}
    >
      {children}
    </button>
  )
}
