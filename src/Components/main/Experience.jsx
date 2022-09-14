import React, { forwardRef } from 'react'
import Section from '../Section'
import { BsPatchCheckFill } from 'react-icons/bs'
import { motion } from 'framer-motion'
import '../css/experience.css'
const Experience = forwardRef((props, experienceRef) => {
  return (
    <Section
      head='My Experience'
      sub='What skills i have?'
      id='experience'
      ref={experienceRef}
    >
      <div className='experience-container'>
        <motion.article
          className='front skill-card'
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className='section-header'>Frontend development</div>
          <Skills skill='HTML' skillRatio='90%' />
          <Skills skill='CSS' skillRatio='90%' />
          <Skills skill='JavaScript' skillRatio='80%' />
          <Skills skill='React JS' skillRatio='60%' />
          <Skills skill='BootStrap' skillRatio='30%' />
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
            <AddintionalSkills head='Node JS' skillRatio='Intermidiate' />
            <AddintionalSkills head='GitHub' skillRatio='Experienced' />
            <AddintionalSkills head='Git' skillRatio='Basic' />
            <AddintionalSkills head='MongoDB' skillRatio='Experienced' />
            <AddintionalSkills head='Express JS' skillRatio='Basic' />
          </div>
        </motion.article>
      </div>
    </Section>
  )
})

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
