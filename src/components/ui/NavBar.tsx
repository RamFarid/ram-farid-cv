import type { ReactNode } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/utils'

export type NavLink = { label: string; href: string }

type NavBarProps = {
  /** "Ram" in both languages. */
  name: string
  /** Accessible name of the home link, e.g. "Ram Farid, home". */
  homeLabel: string
  homeHref?: string
  /** The page's sections, max five. Hidden under md; pass a menu in `menu`. */
  links: NavLink[]
  /** The current link's href. */
  active?: string
  /** Controls at the end of the bar (language switch, CV). */
  action?: ReactNode
  /** Shown only under md, where the links collapse. */
  menu?: ReactNode
  ariaLabel: string
  className?: string
}

const linkClasses =
  'inline-flex h-9 items-center rounded-md px-space-3 text-label text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink aria-[current]:bg-primary-soft aria-[current]:text-primary-ink'

// The floating top bar. See docs/design-system/components/NavBar/README.md
export function NavBar({
  name,
  homeLabel,
  homeHref = '/',
  links,
  active,
  action,
  menu,
  ariaLabel,
  className,
}: NavBarProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'scroll-shadow flex h-nav items-center gap-space-4 rounded-lg border border-line bg-surface ps-space-4 pe-space-3 md:gap-space-6 md:ps-space-5',
        className,
      )}
    >
      <Link
        href={homeHref}
        aria-label={homeLabel}
        className="inline-flex shrink-0 items-center gap-2.5 rounded-sm text-h3 leading-none font-bold tracking-[-0.03em] text-logo-word"
      >
        <Image src="/brand/ram-icon.svg" alt="" width={28} height={28} priority />
        {name}
      </Link>

      <ul className="ms-auto hidden items-center gap-space-1 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={link.href === active ? 'location' : undefined}
              className={linkClasses}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="ms-auto flex items-center gap-space-2 md:ms-0">
        {action}
        {menu && <div className="md:hidden">{menu}</div>}
      </div>
    </nav>
  )
}
