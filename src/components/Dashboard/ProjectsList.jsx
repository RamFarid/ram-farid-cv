import AddProjectBtn from './AddProjectBtn'
import SingleProjectCard from './SingleProjectCard'

function ProjectsList({ projects }) {
  return (
    <ul className='projects-list portfolio-co'>
      {projects.length > 0 ? (
        projects.map((project) => {
          return <SingleProjectCard {...project} key={project.id + 1} />
        })
      ) : (
        <AddProjectBtn />
      )}
    </ul>
  )
}

export default ProjectsList
