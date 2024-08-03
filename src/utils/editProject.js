'use server'

import checkToken from '@/lib/auth/checkToken'
import admin from '@/lib/firebase/server'
import { cookies } from 'next/headers'

export default async function editProject(project, id) {
  const tooken = cookies().get('tooken')?.value.trim()
  // { imgURL, title, demoURL, githubURL, usages, slug }
  if (!tooken)
    throw new Error('Only Ram Farid has the access edit his projects')
  try {
    await checkToken(tooken)
  } catch (error) {
    throw new Error('Only Ram Farid has the access edit his projects')
  }
  try {
    await admin
      .firestore()
      .collection('projects')
      .doc(id)
      .update({
        ...project,
        time: {
          start: getFirebaseDateFormat(project?.time?.start),
          end: getFirebaseDateFormat(project?.time?.end),
          lastUpdate: getFirebaseDateFormat(project?.time?.lastUpdate),
        },
      })
    return true
  } catch (error) {
    throw error
  }
}

const getFirebaseDateFormat = (timeInterval) =>
  timeInterval
    ? admin.firestore.Timestamp.fromDate(new Date(timeInterval))
    : null
