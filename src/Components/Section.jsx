import React from 'react'

const Section = (props) => {
  return (
    <section className={props.className}>
      <p className='sub-text'>{props.sub}</p>
      <h2 className='section-header'>{props.head}</h2>
      {props.children}
    </section>
  )
}

export default Section
