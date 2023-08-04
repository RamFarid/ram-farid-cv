import Section from '@/components/reusables/Section'
import getProjectBySlug from '@/utils/getProjectBySlug'
import timestampToUserReadableTime from '@/utils/timestampToUserReadableTime'
import { notFound } from 'next/navigation'
import '@/styles/project-page.css'
import SingleSkill from '@/components/Portfolio/SingleSkill'
import MarkDown from '@/components/Portfolio/MarkDown'
import WorkCardActions from '@/components/Portfolio/WorkCardActions'
import { BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export function generateMetadata({ params: { slug } }) {
  let titleFromSlug = slug.replace(/-/g, ' ')
  const f =
    titleFromSlug.charAt(0).toUpperCase() + titleFromSlug.slice(1).toLowerCase()
  return {
    title: `${f} | Portfolio`,
  }
}

export default async function PortfolioSlug({ params: { slug } }) {
  const project = await getProjectBySlug(slug)
  const hasReact = project?.usages?.includes('react')
  const hasNext = project?.usages?.includes('next')
  const hasMui = project?.usages?.includes('mui')
  const hasSASS = project?.usages?.includes('sass')
  const hasCSS = project?.usages?.includes('css')
  const isPure = project?.usages?.includes('pure')
  const hasFirebase = project?.usages?.includes('firebase')
  const hasNode = project?.usages?.includes('node.js')
  const hasTelegramBot = project?.usages?.includes('telegraf.js')
  const hasMongoDB = project?.usages?.find((u) => u.toLowerCase() === 'mongodb')
  if (!project) return notFound()
  return (
    <>
      <Section
        sub={timestampToUserReadableTime(project.time)}
        head={project.title}
        className='single-project-page'
      >
        <Link href='/portfolio' className='primary-btn back-btn'>
          <BsArrowLeft />
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.imgURL} alt={project.title} />
        <div className='desc'>
          <MarkDown desc={project.description || ''} />
        </div>
        <h3 className='usages'>Usages</h3>
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
        <div className='actions'>
          <WorkCardActions
            demoURL={project.demoURL}
            githubURL={project.githubURL}
            title={project.title}
          />
        </div>
      </Section>
    </>
  )
}
