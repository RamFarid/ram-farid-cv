'use server'

import admin from '@/lib/firebase/server'

export default async function editProject(project, id) {
  // { imgURL, title, demoURL, githubURL, usages, slug }
  try {
    await admin.firestore().collection('projects').doc(id).update(project)
    return true
  } catch (error) {
    throw error
  }
}
