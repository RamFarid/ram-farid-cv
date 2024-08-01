import '@/styles/header.css'
import Link from 'next/link'

function Header() {
  return (
    <header>
      <Link href={'/'}>
        {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
        <img src='/Assets/logo.png' alt='Ram Farid Logo' />
      </Link>
    </header>
  )
}

export default Header
