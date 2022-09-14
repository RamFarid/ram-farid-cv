import React, { forwardRef } from 'react'
import Section from '../Section'
import Button from '../Button'
import SmallCards from '../SmallCards'
import meAbout from '../../Assets/me-about.jpeg'
import { FaUserPlus, FaAward } from 'react-icons/fa'
import { VscFolderLibrary } from 'react-icons/vsc'
import '../css/about.css'
const About = forwardRef((props, aboutRef) => {
  return (
    <Section
      sub='get to know'
      head='about me'
      className='about'
      id='about'
      ref={aboutRef}
    >
      <div className='main'>
        <div className='left-hand'>
          <img src={meAbout} alt='myphoto' />
        </div>
        <div className='right-hand'>
          <div className='cards'>
            <SmallCards icon={<FaAward />} head='Experience' sub='6 Monthes' />
            <SmallCards icon={<FaUserPlus />} head='Clients' sub='No clients' />
            <SmallCards
              icon={<VscFolderLibrary />}
              head='Projects'
              sub='3 Projects'
            />
          </div>
          <div className='sub-text'>
            That is my first real project, I thought it was better to build that
            CV to show you my actual skills, I make many different small
            projects{' '}
            <span>
              <a href='#portfolio'>see it</a>
            </span>
            , I love programming not just a work, PROGRAMMING IS MY LIFE
          </div>
          <Button primary='true' href='#contact-me'>
            Contact Me
          </Button>
        </div>
      </div>
    </Section>
  )
})

export default About
