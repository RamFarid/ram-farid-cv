import React from 'react'
import Section from '../Components/Section'
import Download from '../Components/Download'
import Typewriter from 'typewriter-effect'
import '../Components/css/home.css'
import { BsFacebook, BsGithub, BsInstagram } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'

const Home = () => {
  return (
    <Section className='home-sec'>
      <div className='animation mb-sections'>
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
          <NavLink className='primary-btn' to='contact'>
            Let's Talk!
          </NavLink>
          <Download />
        </div>
      </div>
    </Section>
  )
}

export default Home
