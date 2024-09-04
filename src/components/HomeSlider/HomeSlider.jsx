import '@/styles/scroller.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-flip'
import About from '../sections/About'
import ContactMe from '../sections/Contact'
import Experience from '../sections/Experience'
import Landing from '../sections/Landing'
import Services from '../sections/Services'
import Testmonials from '../sections/Testimonials'
import SliderItem from './SliderItem'
import SliderWrapper from './SliderWrapper'

function HomeSlider({ projectsCount, clientsNo, cvFile }) {
  const items = [
    {
      element: <Landing cvFile={cvFile} />,
      sectionProps: { className: 'home-sec' },
      id: 'landing',
      hasFS: false,
    },
    {
      element: <About clientsNo={clientsNo} projectsCount={projectsCount} />,
      sectionProps: {
        sub: 'get to know',
        head: 'about me',
        className: 'about',
      },
      id: 'about-me',
      hasFS: true,
    },
    {
      element: <Experience />,
      sectionProps: {
        head: 'My Experience',
        sub: 'What skills i have?',
        className: 'experience',
      },
      id: 'experience',
      hasFS: true,
    },
    {
      element: <Services />,
      sectionProps: { head: 'Services', sub: 'what i offer?' },
      id: 'services',
      hasFS: false,
    },
    {
      element: <Testmonials />,
      sectionProps: {
        head: 'Testmonials',
        sub: 'Temporary Certs. until I graduate',
      },
      id: 'testimonials',
      hasFS: false,
    },
    {
      element: <ContactMe />,
      sectionProps: {
        className: 'contact',
        sub: 'get in touch',
        head: 'contact me',
      },
      id: 'contact-me',
      hasFS: true,
    },
  ]
  return (
    <SliderWrapper>
      {items.map((item, index) => {
        return (
          <SliderItem
            index={index}
            key={`${item.id}-${index}`}
            sectionProps={item.sectionProps}
            elementId={item.id}
            hasFS={item.hasFS}
          >
            {item.element}
          </SliderItem>
        )
      })}
    </SliderWrapper>
  )
}

export default HomeSlider
