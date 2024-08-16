import admin from '@/lib/firebase/server'

export default async function getCVMetaData() {
  const data = await admin
    .firestore()
    .collection('metadata')
    .doc('cv_data')
    .get()
  return {
    ...data.data(),
    id: data.id,
  }
}
