'use client'
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
import { useState } from 'react'

function HomeSlider({ projectsCount, clientsDoc }) {
  const [activeItem, setActiveItem] = useState(0)
  const items = [
    { element: <Landing />, sectionProps: { className: 'home-sec' } },
    {
      element: <About clientsDoc={clientsDoc} projectsCount={projectsCount} />,
      sectionProps: {
        sub: 'get to know',
        head: 'about me',
        className: 'about',
      },
    },
    {
      element: <Experience />,
      sectionProps: {
        head: 'My Experience',
        sub: 'What skills i have?',
        className: 'experience',
      },
    },
    {
      element: <Services />,
      sectionProps: { head: 'Services', sub: 'what i offer?' },
    },
    {
      element: <Testmonials />,
      sectionProps: {
        head: 'Testmonials',
        sub: 'Temporary Certs. until I graduate',
      },
    },
    {
      element: <ContactMe />,
      sectionProps: {
        className: 'contact',
        sub: 'get in touch',
        head: 'contact me',
      },
    },
  ]
  return (
    <SliderWrapper activeItem={activeItem} setActiveItem={setActiveItem}>
      {items.map((item, index) => {
        return (
          <SliderItem
            index={index}
            activeItem={activeItem}
            key={index}
            sectionProps={item.sectionProps}
          >
            {item.element}
          </SliderItem>
        )
      })}
    </SliderWrapper>
  )
}

export default HomeSlider
