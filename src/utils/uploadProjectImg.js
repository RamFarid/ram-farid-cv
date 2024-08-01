import { storage } from '@/lib/firebase/client'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export default async function uploadProjectImg(file, slugName) {
  try {
    const img = await uploadBytes(ref(storage, 'projects/' + slugName), file)
    const url = await getDownloadURL(img.ref)
    return url
  } catch (error) {
    throw error
  }
}
