'use client'
import { BsCheckLg } from 'react-icons/bs'
import { motion } from 'framer-motion'
function ServicesSkill(props) {
  const { text, delay } = props
  return (
    <motion.div
      className='services-skill-container'
      initial={{ x: -100, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 2, delay: delay, type: 'spring', stiffness: 120 }}
      viewport={{ once: true }}
    >
      <div className='icon'>
        <BsCheckLg />
      </div>
      <div className='services-skill'>{text}</div>
    </motion.div>
  )
}

export default ServicesSkill
