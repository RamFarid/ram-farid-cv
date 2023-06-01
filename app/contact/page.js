import FormMsg from '@/components/ContactMe/FormMsg'
import SocialCards from '@/components/ContactMe/SocialCards'
import Section from '@/components/reusables/Section'
import '@/styles/contact.css'

export const metadata = {
  title: 'Ram Farid | Contact me',
}

export const dynamic = 'force-static'

export default function ContactMe() {
  return (
    <Section sub='get in touch' head='contact me'>
      <div className='contact-co mb-sections'>
        <SocialCards />
        <FormMsg />
      </div>
    </Section>
  )
}
