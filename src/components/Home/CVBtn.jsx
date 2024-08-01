'use client'
import getCVUrl from '@/utils/getCVUrl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

function Download() {
  const [pdfURL, setPdfURL] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    ;(async () => {
      const url = await getCVUrl()
      if (url) setPdfURL(url)
      setIsLoading(false)
    })()
  }, [])
  return isLoading ? (
    <button disabled className='secondary-btn'>
      Loading...
    </button>
  ) : pdfURL ? (
    <a
      className='secondary-btn'
      href={pdfURL}
      download={pdfURL}
      target='_blank'
      rel='noreferrer'
    >
      Download Resume
    </a>
  ) : (
    <Link href='/contact' className='secondary-btn'>
      Download Resume
    </Link>
  )
}

export default Download
