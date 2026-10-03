'use client'

import { useId, useRef, type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import type { NavLink } from '@/components/ui/NavBar'
import { cn } from '@/utils'

type NavMenuProps = {
  links: NavLink[]
  /** Accessible name of the toggle. */
  label: string
  /** Extra controls under the links (the CV button). */
  footer?: ReactNode
}

// The NavBar's links under md, in a native popover: Esc and outside clicks close it, and the toggle gets aria-expanded from the browser.
export function NavMenu({ links, label, footer }: NavMenuProps) {
  const id = useId()
  const popover = useRef<HTMLDivElement>(null)
  // An in-page link doesn't dismiss a popover on its own.
  const close = () => popover.current?.hidePopover()

  return (
    <>
      <button
        type="button"
        popoverTarget={id}
        aria-label={label}
        className="inline-flex size-9 items-center justify-center rounded-md border border-line-strong text-ink transition-colors hover:bg-surface-raised"
      >
        <Menu aria-hidden size={20} strokeWidth={1.75} />
      </button>

      <div
        ref={popover}
        id={id}
        popover="auto"
        aria-label={label}
        className={cn(
          'fixed inset-x-space-4 top-[calc(var(--nav-height)+var(--space-6))] bottom-auto m-0 h-auto w-auto',
          'rounded-lg border border-line bg-surface p-space-3 text-ink shadow-md',
        )}
      >
        <ul className="grid gap-space-1">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={close}
                className="flex h-11 items-center rounded-md px-space-3 text-label text-ink transition-colors hover:bg-surface-raised"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {footer && <div className="mt-space-3 grid border-t border-line pt-space-3">{footer}</div>}
      </div>
    </>
  )
}
