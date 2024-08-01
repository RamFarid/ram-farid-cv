'use client'
import Section from '../reusables/Section'

function SliderItem({ sectionProps, children, index, activeItem }) {
  return (
    <div
      className={`scroller__item ${
        index === activeItem + 1
          ? 'scroller__item-next'
          : index === activeItem - 1
          ? 'scroller__item-prev'
          : ''
      }`.trim()}
    >
      <Section {...sectionProps}>{children}</Section>
    </div>
  )
}

export default SliderItem
