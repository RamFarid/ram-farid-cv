'use server'
import admin from '@/lib/firebase/server'
import makeSlug from './makeSlug'
import getProjectFormData from './getProjectFormData'

export default async function addProject(e, imgURL) {
  // { title, demoURL, githubURL, usages, slug }
  const projectData = getProjectFormData(e)
  const slugName = makeSlug(projectData.title)
  try {
    await admin
      .firestore()
      .collection('projects')
      .add({
        ...projectData,
        slug: slugName,
        imgURL,
        time: admin.firestore.FieldValue.serverTimestamp(),
      })
  } catch (error) {
    throw error
  }
}
