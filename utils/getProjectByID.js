import admin from '@/lib/firebase/server'

export default async function getProjectByID(projectID) {
  try {
    const doc = await admin
      .firestore()
      .collection('projects')
      .doc(projectID)
      .get()
    if (doc.exists) {
      const project = structuredClone(doc.data())
      project.id = doc.id
      project.time = doc.data().time.toDate().getTime()
      return project
    }
    return false
  } catch (error) {
    return false
  }
}
