import React from 'react'
import Button from './Button'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import { information, warning } from '../toastingMsgs'

function WorkCards(props) {
  const { img, title, website, github, react } = props

  const detectedGithub = (e) => {
    e.preventDefault()
    if (github) {
      window.open(github, '_blank')
    } else {
      warning('Sorry, there is no source code for this work')
    }
  }

  const liveDemoHandler = (e) => {
    e.preventDefault()
    if (title.toLowerCase() === 'my cv') {
      information('Great! You are already in my website')
    } else if (!website) {
      warning("Sorry! The work hasn't been deployed")
    } else {
      window.open(website, '_blank')
    }
  }
  return (
    <motion.div
      className='portfolio-card-co'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
      viewport={{ once: true }}
    >
      <div className='img-co'>
        <img src={img} alt={title} />
      </div>
      <div className='title'>{title}</div>
      <div className='btns-co'>
        <Button
          primary='true'
          href={website}
          onClick={(e) => {
            liveDemoHandler(e)
          }}
        >
          Live Show
        </Button>

        <Button onClick={(e) => detectedGithub(e)}>Github</Button>
      </div>
      {react && (
        <div className='react-flag'>
          <span>React JS</span>
        </div>
      )}
    </motion.div>
  )
}

export default WorkCards
