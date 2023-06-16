'use client'
import { useEffect, useState } from 'react'
import WorkCards from './WorkCards'
import Filter from './Filter'

function Projects({ projectsDB }) {
  const [projects, setProjects] = useState(projectsDB)
  const [filters, setFilters] = useState(['all', 'all'])
  useEffect(() => {
    ;(() => {
      if (filters[0] === 'all' && filters[1] === 'all')
        return setProjects(projectsDB)
      if (filters[0] !== 'all') {
        const currentProjects = []
        projectsDB.forEach((singleProduct) => {
          if (singleProduct.usages.includes(filters[0]))
            currentProjects.push(singleProduct)
        })
        setProjects(currentProjects)
      }
    })()
  }, [filters, projectsDB])
  return (
    <>
      <Filter filters={filters} setFilters={setFilters} />
      <div className='portfolio-co mb-sections'>
        {projects.length > 0 ? (
          projects.map((val, id) => {
            return <WorkCards {...val} key={id + Math.random()} /> // { imgURL, title, demoURL, githubURL, usages }
          })
        ) : (
          <div>No projects</div>
        )}
      </div>
    </>
  )
}

export default Projects
