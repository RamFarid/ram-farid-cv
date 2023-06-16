export default function getProjectFormData(form) {
  // { imgURL, title, demoURL, githubURL, usages, projectId}
  const title = form.get('projectname')
  const demoURL = form.get('demoUrl')
  const githubURL = form.get('githubUrl')
  const usages = [form.get('fw'), form.get('styles')]
  const inline = form.get('otherInline').split(',')
  const newOne = usages.concat(inline)
  return {
    title,
    demoURL,
    githubURL,
    usages: newOne,
  }
}
