import SingleProductCardActions from './SingleProductCardActions'

function SingleProjectCard({ imgURL, title, usages, id: projectId, slug }) {
  return (
    <li className='portfolio-card-co single-project'>
      <div className='img-co'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgURL} alt={title} />
      </div>
      <div className='title'>{title}</div>
      <SingleProductCardActions projectId={projectId} slug={slug} />
      {usages?.includes('react') || usages?.includes('next') ? (
        <div className={`react-flag ${usages?.includes('next') && 'next'}`}>
          <span>{usages?.includes('react') ? 'React JS' : 'Next js'}</span>
        </div>
      ) : null}
    </li>
  )
}

export default SingleProjectCard
