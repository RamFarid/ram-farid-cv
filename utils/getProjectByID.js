import admin from '@/lib/firebase/server'

export default async function getProjectByID(projectID) {
  try {
    const doc = await admin
      .firestore()
      .collection('projects')
      .doc(projectID)
      .get()
    return !doc.exists ? false : { ...doc.data(), id: doc.id }
  } catch (error) {
    return false
  }
}
