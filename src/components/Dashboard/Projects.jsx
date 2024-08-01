import AddProjectBtn from './AddProjectBtn'
import ProjectsList from './ProjectsList'

function Projects({ projects }) {
  return (
    <div className='projects-section'>
      <h1>Projects {!projects.length <= 0 && <AddProjectBtn />}</h1>
      <ProjectsList projects={projects} />
    </div>
  )
}

export default Projects
