import getFirebaseDateFormat from './getFirebaseDateFormat'

export default function getProjectFormData(form) {
  // { imgURL, title, demoURL, githubURL, usages, projectId}
  const title = form.get('projectname')
  const demoURL = form.get('demoUrl')
  const githubURL = form.get('githubUrl')
  const usages = [form.get('fw'), form.get('styles')]
  const description = form.get('description')
  const inline = form.get('otherInline').length
    ? form.get('otherInline').split(',')
    : []
  const time = {
    start: getFirebaseDateFormat(form.get('startdate')),
    end: getFirebaseDateFormat(form.get('enddate')),
    lastUpdate: getFirebaseDateFormat(form.get('lastUpdate') || null),
  }
  const newOne = usages.concat(inline)
  return {
    title,
    demoURL,
    githubURL,
    usages: newOne,
    description,
    time,
  }
}
