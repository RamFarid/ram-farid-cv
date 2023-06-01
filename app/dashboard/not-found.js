import '@/styles/error.css'
import Link from 'next/link'
export default function NotFoundDashboard() {
  return (
    <section className='Error dashboard-error'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={'/Assets/404.gif'}
        alt='404_not_found'
        className='Error__photo'
      />
      <h2>404 page not found!</h2>
      <p>Check to see if the link you are trying to open is valid.</p>
      <Link href='/dashboard' className='primary-btn'>
        Go to Dashboard
      </Link>
    </section>
  )
}
