import React from 'react'
import Section from '../Components/Section'
import WorkCards from '../Components/WorkCards'
import { worksData } from '../data/worksData'
import '../Components/css/portfolio.css'
import usePageTitle from '../hooks/usePageTitle'
// import Filter from '../Components/Filter'

const Portfolio = ({ title }) => {
  usePageTitle(title)
  // const [projectStatus, setProjectStatus] = useState({})

  return (
    <Section sub='my works' head='portfolio' className='portfolio'>
      {/* <Filter
        setProjectStatus={setProjectStatus}
        projectStatus={projectStatus}
      /> */}
      <div className='portfolio-co mb-sections'>
        {worksData.map((val, id) => {
          return <WorkCards {...val} key={id} />
        })}
      </div>
    </Section>
  )
}

export default Portfolio
