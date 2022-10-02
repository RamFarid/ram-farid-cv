import React, { useState, useEffect } from 'react'

// Import Components
import NavItems from '../NavItems'

// Import Icons
import { AiOutlineHome } from 'react-icons/ai'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { TbTimeline } from 'react-icons/tb'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { FaRegFolderOpen } from 'react-icons/fa'
import { TiContacts } from 'react-icons/ti'
import { motion } from 'framer-motion'
import { AiOutlineSafetyCertificate } from 'react-icons/ai'

// Import Keyboard Hook
import useDetectKeyboardOpen from 'use-detect-keyboard-open'
// Import styles
import '../css/nav.css'
function Nav({ hashtag }) {
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
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 2,
          delay: 0.5,
          type: 'spring',
          stiffness: 100,
        }}
      >
        <NavItems link='#home' hashtag={hashtag}>
          <AiOutlineHome />
        </NavItems>
        <NavItems link='#about' hashtag={hashtag}>
          <BsFillInfoCircleFill />
        </NavItems>
        <NavItems link='#experience' hashtag={hashtag}>
          <TbTimeline />
        </NavItems>
        <NavItems link='#services' hashtag={hashtag}>
          <MdOutlineMiscellaneousServices />
        </NavItems>
        <NavItems link='#portfolio' hashtag={hashtag}>
          <FaRegFolderOpen />
        </NavItems>
        <NavItems link='#testmonials' hashtag={hashtag}>
          <AiOutlineSafetyCertificate />
        </NavItems>
        <NavItems link='#contact-me' hashtag={hashtag}>
          <TiContacts />
        </NavItems>
      </motion.nav>
    )
  )
}

export default Nav
