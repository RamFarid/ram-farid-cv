'use client'
import Section from '../reusables/Section'

function SliderItem({ sectionProps, children, index, activeItem, elementId }) {
  return (
    <div
      className={`scroller__item ${
        index === activeItem + 1
          ? 'scroller__item-next'
          : index === activeItem - 1
          ? 'scroller__item-prev'
          : ''
      }`.trim()}
      id={elementId}
    >
      <Section {...sectionProps}>{children}</Section>
    </div>
  )
}

export default SliderItem
