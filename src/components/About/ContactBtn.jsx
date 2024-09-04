'use client'
import { useHomeSlider } from '../HomeSlider/SliderWrapper'

function ContactBtn({ text }) {
  const { setActiveItem } = useHomeSlider()
  return (
    <button className='primary-btn' onClick={() => setActiveItem(5)}>
      {text || 'Contact Me'}
    </button>
  )
}

export default ContactBtn
