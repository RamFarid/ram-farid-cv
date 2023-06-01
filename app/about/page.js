import Section from '@/components/reusables/Section'
import SmallCards from '@/components/reusables/SmallCards'
import experienceTime from '@/utils/experienceTime'
import Link from 'next/link'
import { FaAward, FaUserPlus } from 'react-icons/fa'
import { VscFolderLibrary } from 'react-icons/vsc'
import '@/styles/about.css'
import getProjects from '@/utils/getProjects'
import getClientsNo from '@/utils/getClientsNo'

export const metadata = {
  title: 'Ram Farid | About me',
}

export const dynamic = 'force-dynamic'

export default async function About() {
  const [projects, clients] = await Promise.all([getProjects(), getClientsNo()])
  return (
    <Section sub='get to know' head='about me' className='about'>
      <div className='main mb-sections'>
        <div className='left-hand'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width={330}
            height={514.08}
            src={'/Assets/me-about.jpeg'}
            alt='Ram Farid'
          />
        </div>
        <div className='right-hand'>
          <div className='cards'>
            <SmallCards
              icon={<FaAward />}
              head='Experience'
              sub={experienceTime()}
            />
            <SmallCards
              icon={<FaUserPlus />}
              head='Clients'
              sub={`${clients.clientsNo} Clients`}
            />
            <Link href='/portfolio' passHref>
              <SmallCards
                icon={<VscFolderLibrary />}
                head='Projects'
                sub={`${projects.length} Projects`}
              />
            </Link>
          </div>
          <div className='sub-text'>
            Hello, {"I'm"} Ram Farid Front-end developer I have +1.5 years
            experience in Front-End development I can build a fully website with
            all features that make Customer familiar with it, I can build with
            Pure HTML, CSS and JavaScript This is a good choice; but React
            library is a very good one. My react knowledge {"isn't"} a few, I
            know all fundamentals and advanced topics from Error boundaries,
            HOC, Lazy loading advanced hooks (useReducer, useMemo, ...etc) I
            hope to be at the best of your judgment, just work with me, I
            thought it was better to build that CV to show you my actual skills,
            I made many different small projects before{' '}
            <span>
              <Link href='/portfolio'>see it</Link>
            </span>
            I can handle very well with a team, I love programming not just a
            work,{' '}
            <span
              style={{
                color: '#fff',
              }}
            >
              PROGRAMMING
            </span>{' '}
            is my LIFE
          </div>
          <Link className='primary-btn' href='/contact'>
            Contact Me
          </Link>
        </div>
      </div>
    </Section>
  )
}
