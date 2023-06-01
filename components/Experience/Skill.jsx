'use client'
import { motion } from 'framer-motion'

function Skill({ skill, skillRatio }) {
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
            delay: 0.2,
            type: 'tween',
          }}
          viewport={{ once: false }}
        ></motion.div>
      </div>
    </div>
  )
}

export default Skill
