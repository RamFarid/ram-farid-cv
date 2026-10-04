import type { ComponentProps, ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils'
import { Arrow } from './Arrow'

// See docs/design-system/components/Button/README.md. Primary appears at most once per view.
type ButtonStyle = {
  /** `quiet` is a neutral ghost for secondary actions where violet would compete with the one primary (the console). */
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet'
  size?: 'md' | 'sm'
  /** Trailing arrow; mirrors in RTL. */
  arrow?: boolean
  /** Leading icon, e.g. a lucide icon at size 18. */
  icon?: ReactNode
}

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover hover:shadow-glow',
  secondary: 'border-line-strong text-ink hover:border-ink-muted hover:bg-surface-raised',
  ghost: 'px-space-3 text-primary-ink hover:bg-primary-soft',
  quiet: 'px-space-3 text-ink-muted hover:bg-surface-raised hover:text-ink',
}

const sizes = {
  md: 'h-11 px-space-5',
  sm: 'h-9 px-space-4',
}

export function buttonClasses({ variant = 'primary', size = 'md' }: Pick<ButtonStyle, 'variant' | 'size'>) {
  return cn(
    'group inline-flex shrink-0 items-center justify-center gap-space-2 rounded-md border border-transparent text-label whitespace-nowrap',
    'transition-[background-color,border-color,color,box-shadow] duration-(--duration-fast) ease-out',
    'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none',
    sizes[size],
    variants[variant],
  )
}

export function Button({
  variant,
  size,
  arrow,
  icon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonStyle & ComponentProps<'button'>) {
  return (
    <button type={type} className={cn(buttonClasses({ variant, size }), className)} {...props}>
      {icon}
      {children}
      {arrow && <Arrow />}
    </button>
  )
}

type ButtonLinkProps = ButtonStyle &
  Omit<ComponentProps<'a'>, 'href'> & {
    href: string
    /** Opens in a new tab with an up-and-out arrow. */
    external?: boolean
  }

// A link styled as a button. Paths starting with "/" go through the locale-aware Link; hashes and URLs stay plain anchors.
export function ButtonLink({ variant, size, arrow, icon, external, href, className, children, ...props }: ButtonLinkProps) {
  const t = useTranslations('Common')
  const classes = cn(buttonClasses({ variant, size }), className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes} {...props}>
        {icon}
        {children}
        <span className="sr-only">{t('newTab')}</span>
        <Arrow direction="external" />
      </a>
    )
  }

  const content = (
    <>
      {icon}
      {children}
      {arrow && <Arrow />}
    </>
  )

  return href.startsWith('/') ? (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  )
}
