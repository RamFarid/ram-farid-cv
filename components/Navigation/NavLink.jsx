'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavLink({ path, icon, text }) {
  const pathName = usePathname()
  return (
    <Link href={path} className={pathName === path ? 'active' : ''}>
      {icon}
      {text}
    </Link>
  )
}

export default NavLink
