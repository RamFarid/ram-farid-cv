import React, { forwardRef } from 'react'

const Section = forwardRef((props, ref) => {
  return (
    <section className={props.className} id={props.id} ref={ref}>
      <p className='sub-text'>{props.sub}</p>
      <h2 className='section-header'>{props.head}</h2>
      {props.children}
    </section>
  )
})

export default Section
