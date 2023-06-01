import Section from '@/components/reusables/Section'
import WorkCards from '@/components/Portfolio/WorkCards'
import getProjects from '@/utils/getProjects'

export const metadata = {
  title: 'Ram Farid | Portfolio',
}

export const dynamic = 'force-dynamic'

export default async function Portfolio() {
  const projects = await getProjects()
  return (
    <Section sub='my works' head='portfolio' className='portfolio'>
      <div className='portfolio-co mb-sections'>
        {projects.length > 0 ? (
          projects.map((val, id) => {
            return <WorkCards {...val} key={id} /> // { imgURL, title, demoURL, githubURL, usages }
          })
        ) : (
          <div>No projects</div>
        )}
      </div>
    </Section>
  )
}
