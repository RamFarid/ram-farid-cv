import '@/styles/about.css'
import FSWrapper from '@/lib/FS'
import MyImage from '../About/MyImage'
import AboutInfo from '../About/AboutInfo'

export default function About({ projectsCount, clientsNo }) {
  return (
    <>
      <div className='main mb-sections'>
        <FSWrapper
          frontFaceComponent={<MyImage />}
          backFaceComponent={
            <AboutInfo clientsNo={clientsNo} projectsCount={projectsCount} />
          }
        />
      </div>
    </>
  )
}
