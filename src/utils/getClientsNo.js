'use server'

import admin from '@/lib/firebase/server'

export default async function getClientsNo() {
  const doc = await admin
    .firestore()
    .collection('metadata')
    .doc('cv_data')
    .get()
  return doc.data().clientsNo
}
