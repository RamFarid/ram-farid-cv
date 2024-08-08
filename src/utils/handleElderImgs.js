// export default async function handleElderImgs(slugName, files) {
//   const removeElderThumbnail = files[0]
//   const lastLengthNeeded = files.length - 1
//   try {
//     const [files] = await admin
//       .storage()
//       .bucket()
//       .getFiles({ prefix: `projects/${slugName}` })
//     for (const file of files) {
//       const fileFullName = file.name.split('/').pop()
//       const fileData = fileFullName.split('.')
//       const fileName = Number(fileData[0])
//       if (removeElderThumbnail && fileFullName.startsWith('thumbnail.')) {
//         await file.delete()
//       } else if (fileName > lastLengthNeeded) {
//         await file.delete()
//       }
//     }
//   } catch (error) {
//    throw error
//   }
// }

import { storage } from '@/lib/firebase/client'
import { deleteObject, listAll, ref } from 'firebase/storage'

export default async function handleElderImgs(slugName, files) {
  const removeElderThumbnail = files[0]
  const lastLengthNeeded = files.length - 1
  const folderRef = ref(storage, `projects/${slugName}`)

  try {
    const listResult = await listAll(folderRef)

    for (const itemRef of listResult.items) {
      const fileFullName = itemRef.name
      const fileData = itemRef.name.split('.')
      const fileName = Number(fileData[0])

      if (removeElderThumbnail && fileFullName.startsWith('thumbnail')) {
        await deleteObject(itemRef)
      } else if (!fileFullName.startsWith('thumbnail')) {
        await deleteObject(itemRef)
      }
    }
  } catch (error) {
    console.error('Error deleting files:', error)
    throw error
  }
}
