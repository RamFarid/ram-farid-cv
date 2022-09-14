import React, { forwardRef, useState } from 'react'
import Section from '../Section'
import Button from '../Button'
import Nav from './Nav'
import Typewriter from 'typewriter-effect'
import '../css/home.css'
import { BsFacebook, BsGithub, BsInstagram } from 'react-icons/bs'
const Home = forwardRef(({ hash, setHashtag }, homeRef) => {
  const [navAppear, setNavAppear] = useState(false)
  return (
    <Section className='home-sec' id='home' ref={homeRef}>
      <div className='animation'>
        {/*<p className='hello'>Welcome,</p>*/}
        <span className='hello'>
          <Typewriter
            options={{
              cursor: ' ',
            }}
            onInit={(typewriter) => {
              typewriter.typeString('Welcome,').pauseFor(2500).start()
            }}
          />
        </span>
        <span className='my-name'>
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .pauseFor(2000)
                .typeString("I'm Ram Farid")
                .pauseFor(1300)
                .deleteChars(9)
                .pauseFor(900)
                .typeString('Front end developer')
                .pauseFor(1000)
                .deleteAll()
                .pauseFor(900)
                .typeString('Browse my CV!')
                .start()
                .callFunction(() => {
                  console.log('all done!')
                  setNavAppear(true)
                })
            }}
          />
        </span>
        <div className='home-links'>
          <div className='link-co'>
            <a href='https://github.com/RamFarid'>
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
          <Button>Download CV</Button>
        </div>
      </div>
      <Nav hash={hash} setHash={setHashtag} navAppear={navAppear} />
    </Section>
  )
})

export default Home
