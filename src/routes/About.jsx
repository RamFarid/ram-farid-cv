import React from 'react'

// import use components
import Section from '../Components/Section'
import SmallCards from '../Components/SmallCards'
import meAbout from '../Assets/me-about.jpeg'

// import Anchor Link
import { NavLink } from 'react-router-dom'

// import icons
import { FaUserPlus, FaAward } from 'react-icons/fa'
import { VscFolderLibrary } from 'react-icons/vsc'

// import data
import { worksData } from '../data/worksData'
import { useDateExperience } from '../hooks/useDateExperience'

// import style
import '../Components/css/about.css'
import usePageTitle from '../hooks/usePageTitle'

const About = ({ title }) => {
  usePageTitle(title)
  const { time } = useDateExperience()
  return (
    <Section sub='get to know' head='about me' className='about'>
      <div className='main mb-sections'>
        <div className='left-hand'>
          <img src={meAbout} alt='myphoto' />
        </div>
        <div className='right-hand'>
          <div className='cards'>
            <SmallCards icon={<FaAward />} head='Experience' sub={time} />
            <SmallCards icon={<FaUserPlus />} head='Clients' sub='No clients' />
            <NavLink to='/portfolio'>
              <SmallCards
                icon={<VscFolderLibrary />}
                head='Projects'
                sub={`${worksData.length} Projects`}
              />
            </NavLink>
          </div>
          <div className='sub-text'>
            This website is my first real project with react, I thought it was
            better to build that CV to show you my actual skills, I made many
            different small projects before{' '}
            <span>
              <NavLink to='/portfolio'>see it</NavLink>
            </span>
            , I love programming not just a work, PROGRAMMING IS MY LIFE
          </div>
          <NavLink className='primary-btn' to='/contact'>
            Contact Me
          </NavLink>
        </div>
      </div>
    </Section>
  )
}

export default About
