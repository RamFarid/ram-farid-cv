'use server'

import admin from '@/lib/firebase/server'

async function updateSocialLinks(links) {
  try {
    await admin
      .firestore()
      .collection('metadata')
      .doc('social_links')
      .update(links)
    return true
  } catch (error) {
    throw error
  }
}

export default updateSocialLinks
