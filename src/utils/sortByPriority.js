import extractTechs from './extractTechs'

function sortByPriority(projects) {
  if (!projects) return []
  let nextjs = [],
    reactjs = [],
    other = []
  projects.forEach((project) => {
    const { hasNext, hasReact } = extractTechs(project.usages)
    if (hasNext) nextjs.push(project)
    else if (hasReact) reactjs.push(project)
    else other.push(project)
  })
  return nextjs.concat(reactjs).concat(other)
}

export default sortByPriority
