'use client'
import { FaAward, FaUserPlus } from 'react-icons/fa'
import { VscFolderLibrary } from 'react-icons/vsc'
import experienceTime from '@/utils/experienceTime'
import SmallCards from '../reusables/SmallCards'
import Link from 'next/link'
import ContactBtn from './ContactBtn'

function AboutInfo({ className, clientsNo, projectsCount }) {
  return (
    <div className={`right-hand ${className}`.trim()}>
      <div className='cards'>
        <SmallCards
          icon={<FaAward />}
          head='Experience'
          sub={experienceTime()}
        />
        <SmallCards
          icon={<FaUserPlus />}
          head='Clients'
          sub={`${clientsNo} Clients`}
        />
        <Link href='/portfolio' passHref>
          <SmallCards
            icon={<VscFolderLibrary />}
            head='Projects'
            sub={`${projectsCount} Projects`}
          />
        </Link>
      </div>
      <div className='sub-text'>
        As a front-end developer specializing in React JS and Next.js,
        {"I'm"} driven by a passion for creating inspiring digital experiences.
        I love transforming ideas into interactive realities, pushing the
        boundaries of web technology. Each project is a chance to learn,
        innovate, and exceed expectations. My enthusiasm extends beyond coding
        to the entire web creation process. {"I'm"} committed to crafting
        solutions that make a real impact in the digital world.
      </div>
      <ContactBtn />
    </div>
  )
}

export default AboutInfo
