'use server'

import checkToken from '@/lib/auth/checkToken'
import admin from '@/lib/firebase/server'
import { cookies } from 'next/headers'

export default async function editProject(project, id) {
  const tooken = cookies().get('tooken')?.value.trim()
  // { imgURL, title, demoURL, githubURL, usages, slug }
  console.log('B.F')
  if (!tooken)
    throw new Error('Only Ram Farid has the access edit his projects')
  try {
    await checkToken(tooken)
    console.log('A.F')
  } catch (error) {
    throw new Error('Only Ram Farid has the access edit his projects')
  }
  try {
    console.log('B.D')
    await admin.firestore().collection('projects').doc(id).update(project)
    console.log('A.D')
    return true
  } catch (error) {
    throw error
  }
}
