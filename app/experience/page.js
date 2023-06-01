import AddintionalSkills from '@/components/Experience/AddintionalSkills'
import MainSkills from '@/components/Experience/MainSkills'
import Section from '@/components/reusables/Section'
import '@/styles/experience.css'

export const metadata = {
  title: 'Ram Farid | Experience',
}

export const dynamic = 'force-static'

export default function Experience() {
  return (
    <Section head='My Experience' sub='What skills i have?'>
      <div className='experience-container mb-sections'>
        <MainSkills />
        <AddintionalSkills />
      </div>
    </Section>
  )
}
