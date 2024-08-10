import { storage } from '@/lib/firebase/client'
import { deleteObject, listAll, ref } from 'firebase/storage'

export default async function handleElderImgs(slugName, files) {
  const removeElderThumbnail = files[0]
  const folderRef = ref(storage, `projects/${slugName}`)
  let promises = []
  try {
    const listResult = await listAll(folderRef)

    for (const itemRef of listResult.items) {
      const fileFullName = itemRef.name
      const fileData = itemRef.name.split('.')
      const fileName = Number(fileData[0])

      if (removeElderThumbnail && fileFullName.startsWith('thumbnail')) {
        promises.push(deleteObject(itemRef))
      } else if (!fileFullName.startsWith('thumbnail') && files.length > 1) {
        promises.push(deleteObject(itemRef))
      }
    }
    return await Promise.all(promises)
  } catch (error) {
    console.error('Error deleting files:', error)
    throw error
  }
}
