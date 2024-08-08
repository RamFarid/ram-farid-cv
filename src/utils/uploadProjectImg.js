import { storage } from '@/lib/firebase/client'
import { ref, uploadBytes } from 'firebase/storage'

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

const getStorageURL = (PATH) =>
  `https://firebasestorage.googleapis.com/v0/b/ram-farid-cv-c3d7f.appspot.com/o/${encodeURIComponent(
    PATH
  )}?alt=media`
