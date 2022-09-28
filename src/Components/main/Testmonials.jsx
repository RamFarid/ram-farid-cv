import React from 'react'
import { forwardRef } from 'react'
import Section from '../Section'
import '../css/testmonials.css'
import html from '../../Assets/html_cirt.jpg'
import css from '../../Assets/css_cert.jpg'
import js from '../../Assets/js_cert.png'
import webFund from '../../Assets/web_Fund_cirt.jpg'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper'
const Testmonials = forwardRef((props, testmonialsRef) => {
  return (
    <Section
      head='Testmonials'
      sub='look at the sources'
      id='testmonials'
      ref={testmonialsRef}
    >
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
      </Swiper>
    </Section>
  )
})

export default Testmonials
