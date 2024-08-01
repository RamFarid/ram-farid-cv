import Overlay from '../Overlay'

const Section = ({ className, sub, head, children, overlay = true }) => {
  return (
    <section
      className={`${className || ''} ${overlay ? 'overlay' : ''}`.trim()}
    >
      <p className='sub-title'>{sub}</p>
      <h2 className='section-header'>{head}</h2>
      {children}
    </section>
  )
}

export default Section
