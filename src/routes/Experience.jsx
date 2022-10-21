import React from 'react'
// Import Main
import Section from '../Components/Section'

// Import data
import { mainSkills } from '../data/mainSkills'
import { knowledgeSkill } from '../data/knowledgeSkill'
import { BsPatchCheckFill } from 'react-icons/bs'

// Import Animations
import { motion } from 'framer-motion'

// import style
import '../Components/css/experience.css'

const Experience = () => {
  return (
    <Section head='My Experience' sub='What skills i have?'>
      <div className='experience-container mb-sections'>
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
              <Skills
                skill={el.skill}
                skillRatio={el.skillRatio}
                key={id + 14}
              />
            )
          })}
        </motion.article>
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
                <AddintionalSkills
                  head={el.head}
                  skillRatio={el.skillRatio}
                  key={id + 12}
                />
              )
            })}
          </div>
        </motion.article>
      </div>
    </Section>
  )
}

function Skills(props) {
  const { skill, skillRatio } = props
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

function AddintionalSkills(props) {
  const { head, skillRatio } = props
  return (
    <div className='add-skill'>
      <div className='icon'>
        <BsPatchCheckFill />
      </div>
      <div>
        <div>{head}</div>
        <div>{skillRatio}</div>
      </div>
    </div>
  )
}
export default Experience
