import React from 'react'
import Section from '../Components/Section'
import WorkCards from '../Components/WorkCards'
import { worksData } from '../data/worksData'
import '../Components/css/portfolio.css'

const Portfolio = (props, portfolioRef) => {
  return (
    <Section sub='my works' head='portfolio'>
      <div className='portfolio-co mb-sections'>
        {worksData.map((work, id) => {
          return (
            <WorkCards
              title={work.title}
              img={work.img}
              website={work.website}
              github={work.github}
              react={work.isReact}
              key={id + 2}
            />
          )
        })}
      </div>
    </Section>
  )
}

export default Portfolio
