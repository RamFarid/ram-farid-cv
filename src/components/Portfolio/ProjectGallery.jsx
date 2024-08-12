'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'react-photo-view/dist/react-photo-view.css'
import { EffectCards } from 'swiper'
import { PhotoSlider } from 'react-photo-view'
import { Fragment, useState } from 'react'

function ProjectGallery({ images }) {
  const [sliderIndex, setSliderIndex] = useState(0)
  const [isSliderVisible, setIsSliderVisible] = useState(false)
  return (
    <Fragment>
      <PhotoSlider
        images={images.map((img) => ({ src: img, key: img }))}
        visible={isSliderVisible}
        onClose={() => setIsSliderVisible(false)}
        index={sliderIndex}
        onIndexChange={setSliderIndex}
      />
      <Swiper
        effect='cards'
        grabCursor={true}
        modules={[EffectCards]}
        slidesPerView={1}
      >
        {images &&
          images.map((img, index) => {
            return (
              <SwiperSlide
                key={index}
                onClick={() => {
                  setSliderIndex(index)
                  setIsSliderVisible(true)
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={'project.title'} />
              </SwiperSlide>
            )
          })}
      </Swiper>
    </Fragment>
  )
}

export default ProjectGallery
