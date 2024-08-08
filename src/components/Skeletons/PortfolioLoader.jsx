import Skeleton from 'react-loading-skeleton'
import ProjectCardSkeleton from './ProjectCardSkeleton'

function PortfolioLoader() {
  return (
    <>
      <Skeleton width={'10%'} className='center-skeleton' />
      <Skeleton width={'15%'} className='center-skeleton' />
      <Skeleton width={'30%'} className='center-skeleton text-skeleton-3' />
      <div className='portfolio-co'>
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </>
  )
}

export default PortfolioLoader
