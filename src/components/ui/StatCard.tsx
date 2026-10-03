import type { ReactNode } from 'react'
import { cn } from '@/utils'

type StatCardProps = {
  /** A real, current figure, already formatted for the locale. */
  value: ReactNode
  /** Short suffix painted in primary-ink ("+", "yrs"). */
  unit?: string
  /** Under five words. */
  label: ReactNode
  /** Optional context for the figure ("Since November 2021"). */
  note?: ReactNode
  className?: string
}

// One figure and its label. See docs/design-system/components/StatCard/README.md
export function StatCard({ value, unit, label, note, className }: StatCardProps) {
  return (
    <div className={cn('rounded-lg border border-line bg-surface p-space-4 sm:p-space-5', className)}>
      <p className="font-mono text-numeral text-ink tabular-nums">
        {value}
        {unit && <span className="text-primary-ink">{unit}</span>}
      </p>
      <p className="mt-space-2 text-small text-ink">{label}</p>
      {note && <p className="text-small text-ink-muted">{note}</p>}
    </div>
  )
}
