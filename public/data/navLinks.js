import { AiOutlineHome, AiOutlineSafetyCertificate } from 'react-icons/ai'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { FaRegFolderOpen } from 'react-icons/fa'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { TbTimeline } from 'react-icons/tb'
import { TiContacts } from 'react-icons/ti'

const navLinks = [
  {
    href: '/',
    icon: <AiOutlineHome />,
  },
  {
    href: '/about',
    icon: <BsFillInfoCircleFill />,
  },
  {
    href: '/experience',
    icon: <TbTimeline />,
  },
  {
    href: '/services',
    icon: <MdOutlineMiscellaneousServices />,
  },
  {
    href: '/portfolio',
    icon: <FaRegFolderOpen />,
  },
  {
    href: '/testmonials',
    icon: <AiOutlineSafetyCertificate />,
  },
  {
    href: '/contact',
    icon: <TiContacts />,
  },
]

export default navLinks
