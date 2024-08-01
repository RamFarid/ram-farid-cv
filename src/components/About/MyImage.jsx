'use client'
function MyImage({ className }) {
  return (
    <div className={`left-hand ${className}`.trim()}>
      <div className='img-wrapper'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          width={330}
          height={514.08}
          src={'/Assets/me-about.jpeg'}
          alt='Ram Farid'
        />
      </div>
    </div>
  )
}

export default MyImage
