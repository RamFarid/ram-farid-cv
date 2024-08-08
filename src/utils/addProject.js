'use server'
import admin from '@/lib/firebase/server'
import makeSlug from './makeSlug'
import getProjectFormData from './getProjectFormData'

export default async function addProject(e, imgsURLs) {
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
        imgURL: imgsURLs[0],
        gallery: imgsURLs.slice(1),
      })
  } catch (error) {
    throw error
  }
}
