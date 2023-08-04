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
    text: 'Home',
  },
  {
    href: '/about',
    icon: <BsFillInfoCircleFill />,
    text: 'About',
  },
  {
    href: '/experience',
    icon: <TbTimeline />,
    text: 'Experience',
  },
  {
    href: '/services',
    icon: <MdOutlineMiscellaneousServices />,
    text: 'Services',
  },
  {
    href: '/portfolio',
    icon: <FaRegFolderOpen />,
    text: 'Projects',
  },
  {
    href: '/testmonials',
    icon: <AiOutlineSafetyCertificate />,
    text: 'Testmonials',
  },
  {
    href: '/contact',
    icon: <TiContacts />,
    text: 'Contact Us',
  },
]

export default navLinks
