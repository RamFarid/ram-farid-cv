import Link from 'next/link'
import '@/styles/error.css'
import Image from 'next/image'

export const metadata = {
  title: 'Not Found!',
}

function NotFound() {
  return (
    <section className='Error'>
      <Image
        src={'/Assets/error.svg'}
        alt='404_not_found'
        className='Error__photo'
        width={112}
        height={112}
      />
      <h2>404 page not found!</h2>
      <p>Check to see if the link you are trying to open is valid.</p>
      <Link href='/' className='primary-btn'>
        Go to home page
      </Link>
    </section>
  )
}

export default NotFound
