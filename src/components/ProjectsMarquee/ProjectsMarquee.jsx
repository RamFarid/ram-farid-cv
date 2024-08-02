import ProjectMarqueeItem from './ProjectMarqueeItem'
import '@/styles/projects-marquee.css'
import { FaLink } from 'react-icons/fa'
import Link from 'next/link'
import ProjectsMarqueeWrapper from './ProjectsMarqueeWrapper'

function ProjectsMarquee({ projects }) {
  return (
    <>
      <Link href={'/portfolio'} className='marquee-header'>
        <h2>Portfolio</h2>
        <FaLink />
      </Link>
      <ProjectsMarqueeWrapper>
        {projects.map((project) => (
          <ProjectMarqueeItem
            key={project.id}
            img={project.imgURL}
            alt={project.title}
            slug={project.slug}
          />
        ))}
      </ProjectsMarqueeWrapper>
    </>
  )
}

export default ProjectsMarquee
