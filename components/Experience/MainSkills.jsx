'use client'
import { motion } from 'framer-motion'
import Skill from './Skill'
import { mainSkills } from '@/public/data/mainSkills'

function MainSkills() {
  return (
    <motion.article
      className='front skill-card'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className='section-header'>Frontend development</div>
      {mainSkills.map((el, id) => {
        return (
          <Skill skill={el.skill} skillRatio={el.skillRatio} key={id + 14} />
        )
      })}
    </motion.article>
  )
}

export default MainSkills
