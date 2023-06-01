import { storage } from '@/lib/firebase/client'
import { getDownloadURL, listAll, ref } from 'firebase/storage'
import { toast } from 'react-toastify'

export default async function getCVUrl() {
  try {
    // Get a reference to the CV files folder or any other desired location
    const cvFolderRef = ref(storage)

    // List all items (files and folders) in the CV folder
    const res = await listAll(cvFolderRef)
    // Check if there are no files or folders
    if (res.items.length === 0) return

    // Filter the items to include only CV files
    const cvFiles = res.items.filter((item) => {
      return item.name.startsWith('Ram_CV_v') && item.name.endsWith('.pdf')
    })

    // Sort the files in descending order based on the version number in the file name
    cvFiles.sort((a, b) => {
      const versionA = parseInt(a.name.match(/v(\d+)\.pdf$/)[1])
      const versionB = parseInt(b.name.match(/v(\d+)\.pdf$/)[1])
      return versionB - versionA
    })

    // Get the last version file
    const lastVersionFile = cvFiles[0]

    // Get the download URL for the last version file
    const url = await getDownloadURL(lastVersionFile)

    return url
    // Provide the URL to the user or use it as needed
  } catch (error) {
    toast.error(error.message)
  }
}
