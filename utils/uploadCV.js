import { storage } from '@/lib/firebase/client'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { toast } from 'react-toastify'

export default async function uploadCV(pdfData, version) {
  try {
    if (!pdfData) return
    const cvRef = ref(storage, `Ram_CV_v${version}.pdf`)
    await uploadBytesResumable(cvRef, pdfData)
    toast.success('File Uploaded')
  } catch (error) {
    toast.error(error.message)
    console.log(error)
  }
}
