import { Star } from 'lucide-react'
import { cn } from '@/utils'

/** Marks a starred project. Neutral ink and a hairline, so it reads on violet fields too. See docs/portfolio.md#starred */
export function RecommendedBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn('inline-flex h-7 w-fit items-center gap-1.5 rounded-sm border border-line px-2 text-small text-ink', className)}>
      <Star aria-hidden size={14} strokeWidth={1.75} className="fill-current" />
      {label}
    </span>
  )
}
