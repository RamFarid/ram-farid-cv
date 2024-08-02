import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import '@/styles/skeletons.css'

export default function SingleProjectSkeleton() {
  return (
    <>
      <Skeleton
        className='center-skeleton text-skeleton-2'
        width={'min(50%, 300px)'}
      />
      <Skeleton
        className='center-skeleton'
        style={{
          height: '350px',
          width: 'min(450px, 90%)',
        }}
      />
      <div className='desc-for-skeleton'>
        <Skeleton className='text-skeleton-3' />
        <Skeleton count={3} className='paragraph-skeleton' />
        <Skeleton className='text-skeleton-2' />
        <Skeleton count={7} className='paragraph-skeleton' />
      </div>
    </>
  )
}
