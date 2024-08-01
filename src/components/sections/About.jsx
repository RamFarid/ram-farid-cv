import '@/styles/about.css'
import FSWrapper from '@/lib/FS'
import MyImage from '../About/MyImage'
import AboutInfo from '../About/AboutInfo'

export default function About({ projectsCount, clientsDoc }) {
  return (
    <>
      <div className='main mb-sections'>
        <FSWrapper
          frontFaceComponent={<MyImage />}
          backFaceComponent={
            <AboutInfo clients={clientsDoc} projectsCount={projectsCount} />
          }
        />
      </div>
    </>
  )
}
