import ServiceTitle from '@/components/Services/ServiceTitle'
import ServicesSkill from '@/components/Services/ServicesSkill'
import Section from '@/components/reusables/Section'
import '@/styles/services.css'

export const metadata = {
  title: 'Ram Farid | Services',
}

export const dynamic = 'force-static'

export default function Services() {
  return (
    <Section head='Services' sub='what i offer?'>
      <div className='services-container mb-sections'>
        <div className='front-services'>
          <ServiceTitle title={'Front End for Websites'} />
          <div className='s-c'>
            <ServicesSkill
              text='Responsive, Responsive website is very important for display a website in many screen devices'
              delay='1'
            />
            <ServicesSkill
              text='Animation, animated website make it easy on the eyes, and make it vital'
              delay='1.3'
            />
            <ServicesSkill
              text='PSD into Website, I can make a photoshop pictures into a website with all feauters and additions you want'
              delay='1.6'
            />
            <ServicesSkill
              text='Cheap, I offer you the cheapest price compared to other workers because I do not want money but programming'
              delay='1.9'
            />
          </div>
        </div>
      </div>
    </Section>
  )
}
