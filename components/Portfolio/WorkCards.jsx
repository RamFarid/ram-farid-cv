import WorkCardActions from './WorkCardActions'

function WorkCards({ imgURL, title, demoURL, githubURL, usages }) {
  return (
    <div className='portfolio-card-co'>
      <div className='img-co'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgURL} alt={title} />
      </div>
      <div className='title'>{title}</div>
      <WorkCardActions demoURL={demoURL} title={title} githubURL={githubURL} />
      {usages?.includes('react') || usages?.includes('next') ? (
        <div className={`react-flag ${usages?.includes('next') && 'next'}`}>
          <span>{usages?.includes('react') ? 'React JS' : 'Next js'}</span>
        </div>
      ) : null}
    </div>
  )
}

export default WorkCards
