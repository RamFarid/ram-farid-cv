import React, { useEffect, useState } from 'react'

// Import Components
import NavItems from '../Components/NavItems'

// Import Icons
import { AiOutlineHome } from 'react-icons/ai'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { TbTimeline } from 'react-icons/tb'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { FaRegFolderOpen } from 'react-icons/fa'
import { TiContacts } from 'react-icons/ti'
import { motion } from 'framer-motion'
import { AiOutlineSafetyCertificate } from 'react-icons/ai'

// import Keyboard Hook
import useDetectKeyboardOpen from 'use-detect-keyboard-open'

// Import styles
import '../Components/css/nav.css'
function Nav() {
  const isKeyboardOpen = useDetectKeyboardOpen()
  const [nav, setNav] = useState(true)
  useEffect(() => {
    if (isKeyboardOpen) {
      setNav(false)
    } else {
      setNav(true)
    }
  }, [isKeyboardOpen])
  return (
    nav && (
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{
          duration: 1,
          type: 'spring',
          stiffness: 100,
        }}
      >
        <NavItems link='/'>
          <AiOutlineHome />
        </NavItems>
        <NavItems link='about'>
          <BsFillInfoCircleFill />
        </NavItems>
        <NavItems link='experience'>
          <TbTimeline />
        </NavItems>
        <NavItems link='services'>
          <MdOutlineMiscellaneousServices />
        </NavItems>
        <NavItems link='portfolio'>
          <FaRegFolderOpen />
        </NavItems>
        <NavItems link='testmonials'>
          <AiOutlineSafetyCertificate />
        </NavItems>
        <NavItems link='contact'>
          <TiContacts />
        </NavItems>
      </motion.nav>
    )
  )
}

export default Nav
