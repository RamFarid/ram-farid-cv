import React from 'react'

// import use components
import Section from '../Components/Section'

// import style
import '../Components/css/testmonials.css'

// import certfications images
import html from '../Assets/HTML_cert.jpg'
import css from '../Assets/css_cert.jpg'
import js from '../Assets/js_cert.jpg'
import webFund from '../Assets/web_fundemintals_cert.jpg'
import responsiveDesign from '../Assets/responsive_design_cert.jpg'
import reactRedux from '../Assets/react_redux_cert.jpg'

// import swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
import usePageTitle from '../hooks/usePageTitle'

const Testmonials = ({ title }) => {
  usePageTitle(title)
  return (
    <Section head='Testmonials' sub='look at the sources'>
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className='container-testmonials'
      >
        <SwiperSlide className='img'>
          <img src={html} alt='' />
        </SwiperSlide>
        <SwiperSlide className='img'>
          <img src={css} alt='' />
        </SwiperSlide>
        <SwiperSlide className='img'>
          <img src={js} alt='' />
        </SwiperSlide>
        <SwiperSlide className='img'>
          <img src={webFund} alt='' />
        </SwiperSlide>
        <SwiperSlide className='img'>
          <img src={reactRedux} alt='' />
        </SwiperSlide>
        <SwiperSlide className='img'>
          <img src={responsiveDesign} alt='' />
        </SwiperSlide>
      </Swiper>
    </Section>
  )
}

export default Testmonials
