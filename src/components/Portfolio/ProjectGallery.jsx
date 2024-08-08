'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper'

function ProjectGallery({ images }) {
  console.log(images)
  return (
    <Swiper
      effect='cards'
      grabCursor={true}
      modules={[EffectCards]}
      slidesPerView={1}
    >
      {images &&
        images.map((img, index) => {
          return (
            <SwiperSlide key={index}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={'project.title'} />
            </SwiperSlide>
          )
        })}
    </Swiper>
  )
}

export default ProjectGallery
