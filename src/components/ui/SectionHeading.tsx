import type { ReactNode } from 'react'
import { cn } from '@/utils'

type SectionHeadingProps = {
  /** Put on the heading, for the section's aria-labelledby. */
  id?: string
  /** One or two words, the section's name. */
  eyebrow?: string
  /** Position in the page ("02"), shown before the eyebrow. */
  index?: string
  /** A plain statement in sentence case, no trailing period. */
  title: ReactNode
  description?: ReactNode
  level?: 1 | 2 | 3
  align?: 'start' | 'center'
  className?: string
}

// Opens every page section. See docs/design-system/components/SectionHeading/README.md
export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  description,
  level = 2,
  align = 'start',
  className,
}: SectionHeadingProps) {
  const Heading = `h${level}` as const

  return (
    <div
      className={cn(
        'grid max-w-measure gap-space-3',
        align === 'center' && 'mx-auto justify-items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="font-mono text-eyebrow text-primary-ink uppercase">
          {index && <span className="text-ink-muted">{index} / </span>}
          {eyebrow}
        </p>
      )}
      <Heading id={id} className="text-h2 text-balance text-ink">
        {title}
      </Heading>
      {description && <p className="text-body-lg text-ink-muted">{description}</p>}
    </div>
  )
}
