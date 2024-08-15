import Section from '@/components/reusables/Section'
import getProjects from '@/utils/getProjects'
import Projects from '@/components/Portfolio/Projects'
import '@/styles/portfolio.css'
import StarMsg from '@/components/Portfolio/StarMsg'

export const metadata = {
  title: 'Ram Farid | Portfolio',
}

export const dynamic = 'force-dynamic'

export default async function Portfolio() {
  const projects = await getProjects()
  return (
    <Section
      overlay={false}
      sub='my works'
      head='portfolio'
      className='portfolio'
    >
      <StarMsg />
      <Projects projectsDB={projects} />
    </Section>
  )
}
