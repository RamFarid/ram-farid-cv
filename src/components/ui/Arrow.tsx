import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/utils'

type ArrowProps = {
  /** `external` points up and out, for links that leave the site. */
  direction?: 'forward' | 'external'
  className?: string
}

// A trailing arrow that mirrors in RTL and nudges 3px toward its direction when its `group` parent is hovered.
export function Arrow({ direction = 'forward', className }: ArrowProps) {
  const Icon = direction === 'external' ? ArrowUpRight : ArrowRight

  return (
    <Icon
      aria-hidden
      size={18}
      strokeWidth={1.75}
      className={cn(
        'shrink-0 transition-transform duration-(--duration-base) ease-out rtl:-scale-x-100',
        'group-hover:translate-x-[3px] rtl:group-hover:-translate-x-[3px] motion-reduce:transition-none',
        direction === 'external' && 'group-hover:-translate-y-[3px]',
        className,
      )}
    />
  )
}
