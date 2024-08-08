'use server'

import admin from '@/lib/firebase/server'

async function deleteProject(projectId, slugName) {
  try {
    await admin
      .storage()
      .bucket()
      .deleteFiles({ prefix: `projects/${slugName}` })
    await admin.firestore().collection('projects').doc(projectId).delete()
  } catch (error) {
    throw error
  }
}

export default deleteProject
