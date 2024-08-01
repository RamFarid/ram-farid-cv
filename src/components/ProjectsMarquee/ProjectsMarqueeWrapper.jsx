import React from 'react'

function ProjectsMarqueeWrapper({ children }) {
  const itemsCount = React.Children.count(children)
  const marqueeWidth = itemsCount * 100 + 16 * (itemsCount - 1)
  const animationDuration = Math.ceil(marqueeWidth / 58)
  return (
    <div className='marquee__container'>
      <ul
        className='marquee__content'
        style={{
          '--marquee-width': `-${marqueeWidth}px`,
          animation: `infinite-marquee ${animationDuration}s linear infinite`,
        }}
      >
        {children}
      </ul>
    </div>
  )
}

export default ProjectsMarqueeWrapper
