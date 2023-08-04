'use client'
import useDetectKeyboardOpen from 'use-detect-keyboard-open'
import NavLink from './NavLink'
import navLinks from '@/public/data/navLinks'
import { usePathname } from 'next/navigation'
function Nav() {
  const isKeyboardOpen = useDetectKeyboardOpen()
  const pathname = usePathname()
  return !isKeyboardOpen && !pathname.includes('/dashboard') ? (
    <nav>
      {navLinks.map((link, id) => (
        <NavLink
          key={id + 26}
          icon={link.icon}
          path={link.href}
          text={link.text}
        />
      ))}
    </nav>
  ) : null
}

export default Nav
