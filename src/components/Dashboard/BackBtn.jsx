'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BsArrowLeft } from 'react-icons/bs'

function BackBtn({ noAccess }) {
  const router = useRouter()
  return (
    <Link
      className='primary-btn back-btn'
      onClick={(e) => {
        if (noAccess) {
          e.preventDefault()
          router.back()
        }
      }}
      href={'/dashboard'}
    >
      <BsArrowLeft />
    </Link>
  )
}

export default BackBtn
