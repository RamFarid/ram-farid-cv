export default function getProjectFormData(form) {
  // { imgURL, title, demoURL, githubURL, usages, projectId}
  const title = form.get('projectname')
  const demoURL = form.get('demoUrl')
  const githubURL = form.get('githubUrl')
  const usages = [form.get('fw'), form.get('styles')]
  return {
    title,
    demoURL,
    githubURL,
    usages,
  }
}
