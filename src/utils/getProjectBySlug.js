import admin from '@/lib/firebase/server'

async function getProjectBySlug(slugName) {
  const snapShots = await admin
    .firestore()
    .collection('projects')
    .where('slug', '==', slugName)
    .get()
  if (snapShots.empty) return false
  return {
    ...snapShots.docs[0].data(),
    id: snapShots.docs[0].id,
  }
}

export default getProjectBySlug
