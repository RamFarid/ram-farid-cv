import Link from 'next/link'
import Button from '../reusables/Button'
import SingleSkill from './SingleSkill'
import WorkCardActions from './WorkCardActions'

function WorkCards({ imgURL, title, demoURL, githubURL, usages, slug }) {
  const hasReact = usages?.includes('react')
  const hasNext = usages?.includes('next')
  const hasMui = usages?.includes('mui')
  const hasSASS = usages?.includes('sass')
  const hasCSS = usages?.includes('css')
  const isPure = usages?.includes('pure')
  const hasFirebase = usages?.includes('firebase')
  const hasNode = usages?.includes('node.js')
  const hasTelegramBot = usages?.includes('telegraf.js')
  const hasMongoDB = usages?.find((u) => u.toLowerCase() === 'mongodb')
  return (
    <div className='portfolio-card-co'>
      <div className='img-co'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgURL} alt={title} />
      </div>
      <div className='title'>{title}</div>
      <Link
        href={`/portfolio/${slug}`}
        className='secondary-btn'
        style={{
          width: '100%',
        }}
      >
        More
      </Link>
      {hasReact || hasNext ? (
        <div className={`react-flag ${hasNext && 'next'}`}>
          <span>{hasReact ? 'React JS' : 'Next js'}</span>
        </div>
      ) : null}
      <div className='skills-co'>
        {hasReact && (
          <SingleSkill img={'/Assets/react-svg.svg'} title={'Reactjs'} />
        )}
        {hasNext && (
          <SingleSkill img={'/Assets/next-logo.svg'} title={'Nextjs'} />
        )}
        {isPure && (
          <>
            <SingleSkill img={'/Assets/html-logo.svg'} title={'HTML'} />
            <SingleSkill
              img={'/Assets/javascript-logo.svg'}
              title={'JavaScript'}
            />
          </>
        )}
        {hasCSS && <SingleSkill img={'/Assets/css-logo.svg'} title={'CSS'} />}
        {hasSASS && (
          <SingleSkill img={'/Assets/sass-logo.svg'} title={'SASS'} />
        )}
        {hasMui && (
          <SingleSkill img={'/Assets/material-ui-logo.svg'} title={'MUI'} />
        )}
        {hasNode && (
          <SingleSkill img={'/Assets/nodejs-logo.svg'} title={'Nodejs'} />
        )}
        {hasFirebase && (
          <SingleSkill img={'/Assets/firebase-logo.svg'} title={'Firebase'} />
        )}
        {hasTelegramBot && (
          <SingleSkill
            img={'/Assets/bot-father-logo.jpg'}
            title={'Telegram bot'}
          />
        )}
        {hasMongoDB && (
          <SingleSkill img={'/Assets/mongodb.svg'} title={'MongoDB'} />
        )}
      </div>
    </div>
  )
}

export default WorkCards
