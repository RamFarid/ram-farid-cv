import admin from '@/lib/firebase/server'

export default async function getCVUrl() {
  try {
    const data = (
      await admin.firestore().collection('metadata').doc('cv_data').get()
    ).data()
    return data.cvFile
  } catch (error) {
    throw error
  }
}
