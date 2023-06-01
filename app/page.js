import Download from '@/components/Home/Download'
import Section from '@/components/reusables/Section'
import links from '@/public/data/homeLinks'
import Link from 'next/link'
import '@/styles/home.css'

import WelcomeTyper from '@/components/Home/WelcomeTyper'
import IntroTyper from '@/components/Home/IntroTyper'

export default async function Home() {
  return (
    <Section className='home-sec'>
      <div className='animation mb-sections'>
        <WelcomeTyper />
        <IntroTyper />
        {/* <span className='my-name'>Ram fareed</span> */}
        <div className='home-links'>
          {links.map(({ link, icon }, id) => {
            return (
              <div className='link-co' key={id + 5}>
                <a href={link} target='_blank' rel='noreferrer'>
                  {icon}
                </a>
              </div>
            )
          })}
        </div>
        <div className='btns-home'>
          <Link className='primary-btn' href='/contact'>
            {"Let's Talk!"}
          </Link>
          <Download />
        </div>
      </div>
    </Section>
  )
}
