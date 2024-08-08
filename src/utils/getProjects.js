'use server'
import admin from '@/lib/firebase/server'
import sortByPriority from './sortByPriority'

export default async function getProjects(sizeOnly = false, options) {
  const projects = []
  let projectsSize = 0
  const db = admin.firestore()
  const projectsRef = db.collection('projects')
  if (sizeOnly) {
    projectsSize = await projectsRef.count().get()
    return projectsSize.data().count
  }
  const res = await (options?.select
    ? projectsRef
        .select(...[...(options?.select || []), 'time'])
        .orderBy('time', 'desc')
        .get()
    : projectsRef.orderBy('time', 'desc').get())
  if (res.size === projectsSize) return projects
  res.docs.forEach((doc) => {
    if (doc.exists) {
      const currentDoc = structuredClone(doc.data())
      currentDoc.id = doc.id
      projects.push(currentDoc)
    }
  })
  return sortByPriority(projects)
}
