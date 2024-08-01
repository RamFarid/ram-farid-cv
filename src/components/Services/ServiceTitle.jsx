'use client'
import { motion } from 'framer-motion'

function ServiceTitle({ title }) {
  return (
    <motion.div
      className='header'
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {title}
    </motion.div>
  )
}

export default ServiceTitle
