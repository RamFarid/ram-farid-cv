import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { BsFillInfoCircleFill } from 'react-icons/bs'
import { TbTimeline } from 'react-icons/tb'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'
import { FaRegFolderOpen } from 'react-icons/fa'
import { TiContacts } from 'react-icons/ti'
import { motion } from 'framer-motion'
import '../css/nav.css'
function Nav({ hash, setHash, navAppear }) {
  return (
    navAppear && (
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 2,
          type: 'spring',
          stiffness: 200,
        }}
      >
        <a
          href='#home'
          className={hash === '#home' ? 'active' : ''}
          onClick={() => setHash('#home')}
        >
          <AiOutlineHome />
        </a>
        <a
          href='#about'
          onClick={() => setHash('#about')}
          className={hash === '#about' ? 'active' : ''}
        >
          <BsFillInfoCircleFill />
        </a>
        <a
          href='#experience'
          onClick={() => setHash('#experience')}
          className={hash === '#experience' ? 'active' : ''}
        >
          <TbTimeline />
        </a>
        <a
          href='#services'
          onClick={() => setHash('#services')}
          className={hash === '#services' ? 'active' : ''}
        >
          <MdOutlineMiscellaneousServices />
        </a>
        <a
          href='#portfolio'
          onClick={() => setHash('#portfolio')}
          className={hash === '#portfolio' ? 'active' : ''}
        >
          <FaRegFolderOpen />
        </a>
        <a
          href='#contact-me'
          onClick={() => setHash('#contact-me')}
          className={hash === '#contact-me' ? 'active' : ''}
        >
          <TiContacts />
        </a>
      </motion.nav>
    )
  )
}

export default Nav
