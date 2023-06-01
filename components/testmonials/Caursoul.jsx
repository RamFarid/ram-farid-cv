'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import testmonialsImgs from '@/public/data/testmonialsImgs'

function Caursoul() {
  return (
    <Swiper
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className='container-testmonials'
    >
      {testmonialsImgs.map((img, id) => (
        <SwiperSlide className='img' key={id + 1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt='' />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Caursoul
