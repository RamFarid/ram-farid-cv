function ProjectMarqueeItem({ img, alt }) {
  return (
    <li className='project-marquee-item'>
      <div className='img-wrapper'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} />
      </div>
    </li>
  )
}

export default ProjectMarqueeItem
