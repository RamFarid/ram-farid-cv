import React from 'react'
import Button from './Button'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import { information, warning } from '../toastingMsgs'

function WorkCards({ img, title, website, github, status }) {
  const detectedGithub = (e) => {
    e.preventDefault()
    if (!github) {
      warning('Sorry, there is no source code for this work')
      return
    }
    window.open(github, '_blank')
  }

  const liveDemoHandler = (e) => {
    e.preventDefault()
    if (!website && title.toLowerCase() !== 'my cv') {
      warning("Sorry! The work hasn't been deployed")
      return
    }
    switch (title.toLowerCase()) {
      case 'my cv':
        information('Great! You are already in my website')
        return
      default:
        window.open(website, '_blank')
    }
  }
  return (
    <motion.div
      className='portfolio-card-co'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, type: 'just' }}
      viewport={{ once: true }}
    >
      <div className='img-co'>
        <img src={img} alt={title} />
      </div>
      <div className='title'>{title}</div>
      <div className='btns-co'>
        <Button primary='true' href={website} onClick={liveDemoHandler}>
          Live Show
        </Button>

        <Button onClick={(e) => detectedGithub(e)}>Github</Button>
      </div>
      {status.react && (
        <div className='react-flag'>
          <span>React JS</span>
        </div>
      )}
    </motion.div>
  )
}

export default WorkCards
