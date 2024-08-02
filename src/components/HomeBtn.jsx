import Link from 'next/link'
import { FaHome } from 'react-icons/fa'

function HomeBtn() {
  return (
    <Link href={'/'} className='home-btn'>
      <FaHome />
    </Link>
  )
}

export default HomeBtn
