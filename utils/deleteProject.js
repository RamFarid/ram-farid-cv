'use server'

import admin from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'

async function deleteProject(projectId, fileName) {
  try {
    await admin
      .storage()
      .bucket()
      .file(`projects/${fileName}`)
      .delete({ ignoreNotFound: true })
    await admin.firestore().collection('projects').doc(projectId).delete()
    revalidatePath('/dashboard')
  } catch (error) {
    throw error
  }
}

export default deleteProject
