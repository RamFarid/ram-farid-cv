'use client'

import { motion } from 'framer-motion'
// import Keyboard Hook
import useDetectKeyboardOpen from 'use-detect-keyboard-open'
import NavLink from './NavLink'
import navLinks from '@/public/data/navLinks'
import { usePathname } from 'next/navigation'
function Nav() {
  const isKeyboardOpen = useDetectKeyboardOpen()
  const pathname = usePathname()
  return !isKeyboardOpen && !pathname.includes('/dashboard') ? (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      transition={{
        duration: 1,
        type: 'spring',
        stiffness: 100,
      }}
    >
      {navLinks.map((link, id) => (
        <NavLink key={id + 26} icon={link.icon} path={link.href} />
      ))}
    </motion.nav>
  ) : null
}

export default Nav
