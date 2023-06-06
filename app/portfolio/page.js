import Section from '@/components/reusables/Section'
import getProjects from '@/utils/getProjects'
import Projects from '@/components/Portfolio/Projects'

export const metadata = {
  title: 'Ram Farid | Portfolio',
}

export const dynamic = 'force-dynamic'

export default async function Portfolio() {
  const projects = await getProjects()
  return (
    <Section sub='my works' head='portfolio' className='portfolio'>
      <Projects projectsDB={projects} />
    </Section>
  )
}
