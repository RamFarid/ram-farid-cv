import admin from '@/lib/firebase/server'

async function getSocialLinks() {
  const doc = await admin
    .firestore()
    .collection('metadata')
    .doc('social_links')
    .get()
  return doc.data() ?? {}
}

export default getSocialLinks
