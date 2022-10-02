import React, { forwardRef } from 'react'
import Section from '../Section'
import Button from '../Button'
import Nav from './Nav'
import Download from '../Download'
import Typewriter from 'typewriter-effect'
import '../css/home.css'
import { BsFacebook, BsGithub, BsInstagram } from 'react-icons/bs'

const Home = forwardRef(({ hashtag }, homeRef) => {
  return (
    <Section className='home-sec' id='home' ref={homeRef}>
      <div className='animation'>
        <span className='hello'>
          <Typewriter
            options={{
              cursor: ' ',
            }}
            onInit={(typewriter) => {
              typewriter.typeString('Welcome,').start()
            }}
          />
        </span>
        <span className='my-name'>
          <Typewriter
            options={{
              loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .changeDelay(70)
                .pauseFor(2000)
                .changeDeleteSpeed(70)
                .typeString("I'm Ram Farid")
                .pauseFor(1500)
                .changeDeleteSpeed(70)
                .deleteChars(9)
                .pauseFor(900)
                .typeString('Front end developer')
                .changeDeleteSpeed(70)
                .pauseFor(1000)
                .deleteAll()
                .pauseFor(900)
                .typeString('Browse my CV!')
                .pauseFor(2000)
                .start()
            }}
          />
        </span>
        <div className='home-links'>
          <div className='link-co'>
            <a
              href='https://github.com/RamFarid'
              target='_blank'
              rel='noreferrer'
            >
              <BsGithub />
            </a>
          </div>
          <div className='link-co'>
            <a
              href='https://facebook.com/rraaamm_s'
              target='_blank'
              rel='noreferrer'
            >
              <BsFacebook />
            </a>
          </div>
          <div className='link-co'>
            <a
              href='https://www.instagram.com/ramfarid_s/'
              target='_blank'
              rel='noreferrer'
            >
              <BsInstagram />
            </a>
          </div>
        </div>
        <div className='btns-home'>
          <Button primary='true' href='#contact-me'>
            Let's Talk!
          </Button>
          <Download />
        </div>
      </div>
      <Nav hashtag={hashtag} />
    </Section>
  )
})

export default Home
