'use client'
import { motion } from 'framer-motion'

function Skill({ skill, skillRatio, order }) {
  return (
    <div className='skill-container'>
      <span>{skill}</span>
      <div className='skill-ratio'>
        <motion.div
          className='the-ratio'
          data-skill={skillRatio}
          initial={{ width: 0 }}
          whileInView={{ width: skillRatio }}
          transition={{
            duration: 1,
            delay: order * 0.2 + 1,
            type: 'tween',
          }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </div>
  )
}

export default Skill
