import admin from '@/lib/firebase/server'

export default async function getProjects() {
  const projects = []
  const res = await admin
    .firestore()
    .collection('projects')
    .orderBy('time', 'desc')
    .get()
  if (res.size === 0) return projects
  res.docs.forEach((doc) => {
    if (doc.exists) {
      projects.push({ ...doc.data(), id: doc.id })
    }
  })
  return projects
}
