import React from 'react'
import Section from '../Components/Section'
import Download from '../Components/Download'
import Typewriter from 'typewriter-effect'
import '../Components/css/home.css'
import { NavLink } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import links from '../data/homeLinks'

const Home = ({ title }) => {
  usePageTitle(title)
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
          {links.map(({ link, icon }) => {
            return (
              <div className='link-co'>
                <a href={link} target='_blank' rel='noreferrer'>
                  {icon}
                </a>
              </div>
            )
          })}
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
