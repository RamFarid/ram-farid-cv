import Section from '@/components/reusables/Section'
import Caursoul from '@/components/testmonials/Caursoul'
import '@/styles/testmonials.css'
import 'swiper/css'
import 'swiper/css/pagination'

export const metadata = {
  title: 'Ram Farid | Testmonials',
}

export const dynamic = 'force-static'

export default function Testmonials() {
  return (
    <Section head='Testmonials' sub='look at the sources'>
      <Caursoul />
    </Section>
  )
}
