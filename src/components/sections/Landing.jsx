import CVBtn from '../Home/CVBtn'
import links from '../../../public/data/homeLinks'

import WelcomeTyper from '../Home/WelcomeTyper'
import IntroTyper from '../Home/IntroTyper'
import ContactBtn from '../About/ContactBtn'

export default function Landing({ cvFile, socialLinks }) {
  return (
    <>
      <div className='animation mb-sections'>
        <WelcomeTyper />
        <IntroTyper />
        {/* <span className='my-name'>Ram fareed</span> */}
        <div className='home-links'>
          {links.map(({ icon, id }) => {
            return (
              <div className='link-co' key={id + 5}>
                <a href={socialLinks[id]} target='_blank' rel='noreferrer'>
                  {icon}
                </a>
              </div>
            )
          })}
        </div>
        <div className='btns-home'>
          <ContactBtn text={"Let's Talk!"} />
          <CVBtn cvFile={cvFile} />
        </div>
      </div>
    </>
  )
}
