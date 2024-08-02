import Link from 'next/link'

function ProjectMarqueeItem({ img, alt, slug }) {
  return (
    <Link href={`/portfolio#${slug}`}>
      <li className='project-marquee-item'>
        <div className='img-wrapper'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={alt} />
        </div>
        <div className='overlay' />
        <span>{alt}</span>
      </li>
    </Link>
  )
}

export default ProjectMarqueeItem
