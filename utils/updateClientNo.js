'use server'

import admin from '@/lib/firebase/server'

export default async function updateClientNo(cn) {
  try {
    if (isNaN(Number(cn)) || cn === '') return false
    await admin.firestore().collection('metadata').doc('clients').set({
      clientsNo: cn,
    })
    return true
  } catch (error) {
    throw error
  }
}
