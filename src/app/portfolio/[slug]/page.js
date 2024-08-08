import Section from '@/components/reusables/Section'
import getProjectBySlug from '@/utils/getProjectBySlug'
import timestampToUserReadableTime from '@/utils/timestampToUserReadableTime'
import { notFound } from 'next/navigation'
import '@/styles/project-page.css'
import MarkDown from '@/components/Portfolio/MarkDown'
import WorkCardActions from '@/components/Portfolio/WorkCardActions'
import { BsArrowLeft } from 'react-icons/bs'
import Link from 'next/link'
import Techs from '@/components/Portfolio/Techs'
import ProjectGallery from '@/components/Portfolio/ProjectGallery'
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
  if (!project) return notFound()
  return (
    <>
      <Section
        overlay={false}
        // sub={timestampToUserReadableTime(project.time, false)}
        head={project.title}
        className='single-project-page'
      >
        <Link href='/portfolio' className='primary-btn back-btn'>
          <BsArrowLeft />
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* <img src={project.imgURL} alt={project.title} /> */}
        <ProjectGallery
          images={[project.imgURL, ...(project?.gallery || [])]}
        />
        <div className='desc'>
          <div className='dates'>
            {/* Start and End | Start and First version and Last updated */}
            <div className='single-date-data'>
              <span className='sub-text'>Start:</span>
              <span>
                {timestampToUserReadableTime(project.time?.start, false)}
              </span>
            </div>
            <div className='single-date-data'>
              <span className='sub-text'>
                {project.time?.lastUpdate ? 'First version: ' : 'End:'}
              </span>
              <span>
                {timestampToUserReadableTime(project.time.end, false)}
              </span>
            </div>
            {project.time?.lastUpdate && (
              <div className='single-date-data'>
                <span className='sub-text'>Last update:</span>
                <span>
                  {timestampToUserReadableTime(project.time.lastUpdate, false)}
                </span>
              </div>
            )}
          </div>
          <Link
            href={`/dashboard/project/edit/${project.id}`}
            className='primary-btn edit-project-btn'
          >
            Edit the project
          </Link>
          <MarkDown desc={project.description || ''} />
        </div>
        <h3 className='usages'>Usages</h3>
        <Techs usages={project?.usages} />
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
