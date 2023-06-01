'use client'
import { motion } from 'framer-motion'
import AddintionalSkill from './AddintionalSkill'
import { knowledgeSkill } from '@/public/data/knowledgeSkill'

function AddintionalSkills() {
  return (
    <motion.article
      className='knowlege skill-card'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className='section-header'>I also have knowledge in:</div>
      <div className='ad-skills-container'>
        {knowledgeSkill.map((el, id) => {
          return (
            <AddintionalSkill
              head={el.head}
              skillRatio={el.skillRatio}
              key={id + 12}
            />
          )
        })}
      </div>
    </motion.article>
  )
}

export default AddintionalSkills
