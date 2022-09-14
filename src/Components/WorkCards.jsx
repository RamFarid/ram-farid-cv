import React from 'react'
import Button from './Button'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
function WorkCards(props) {
  const { img, title, website, github, delay, children } = props
  const detectedGithub = () => {
    if (github) {
      window.open(github, '_blank')
    } else {
      warning()
    }
  }
  const liveDemoHandler = (e) => {
    e.preventDefault()
    if (title.toLowerCase() === 'my cv') {
      info()
    } else {
      window.open(website, '_blank')
    }
  }
  const warning = () => {
    toast.warning('Sorry, there is no source code for this work', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  const info = () => {
    toast.info('Great! You are already in my website', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  return (
    <motion.div
      className='portfolio-card-co'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: delay }}
      viewport={{ once: true }}
    >
      <div className='img-co'>
        <img src={img} alt='cover' />
      </div>
      <div className='title'>{title}</div>
      {children}
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

        <Button onClick={() => detectedGithub()}>Github</Button>
      </div>
    </motion.div>
  )
}

export default WorkCards
