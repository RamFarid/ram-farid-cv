import React, { forwardRef } from 'react'
import Section from '../Section'
import WorkCards from '../WorkCards'
import { worksData } from '../../data/worksData'
import '../css/portfolio.css'
const Portfolio = forwardRef((props, portfolioRef) => {
  return (
    <Section sub='my works' head='portfolio' id='portfolio' ref={portfolioRef}>
      <div className='portfolio-co'>
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
})

export default Portfolio
