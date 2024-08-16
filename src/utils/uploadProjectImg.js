import { storage } from '@/lib/firebase/client'
import { ref, uploadBytes } from 'firebase/storage'
import getStorageURL from './getStorageURL'

export default async function uploadProjectImg(file, PATH) {
  // projects
  //  /project1
  //    /thumbnail.jpg
  //    /1.jpg
  //    /2.png
  //    /3.jpg
  try {
    const img = await uploadBytes(ref(storage, `projects/${PATH}`), file)
    return getStorageURL(img.ref.fullPath)
  } catch (error) {
    throw error
  }
}
