import Link from 'next/link'
import { BsArrowLeft } from 'react-icons/bs'

function BackBtn() {
  return (
    <Link className='primary-btn back-btn' href='/dashboard'>
      <BsArrowLeft />
    </Link>
  )
}

export default BackBtn
