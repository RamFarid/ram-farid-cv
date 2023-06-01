'use client'
import uploadCV from '@/utils/uploadCV'
import { useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { toast } from 'react-toastify'

function CVInput() {
  const [file, setFile] = useState(null)
  const [version, setVersion] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const handleUploadCV = async () => {
    if (!file) return toast.warning('Selet file to upload')
    if (!version) return toast.warning('Type version number')
    setIsUploading(true)
    await uploadCV(file, version)
    setIsUploading(false)
    setFile(null)
    setVersion('')
  }
  return (
    <>
      <div className='inp-file-co'>
        <input
          type='file'
          id='cv-file'
          onChange={(e) => setFile(e.target.files[0])}
          accept='application/pdf'
        />
        <label htmlFor='cv-file'>
          <AiOutlineCloudUpload color='var(--color-primary)' size={60} />{' '}
          <span>Upload PDF CV</span>
        </label>
        <div className='file-name'>{file?.name}</div>
      </div>
      <div className='inp-co version-no'>
        <input
          type='number'
          onChange={(e) => setVersion(e.target.value)}
          value={version}
          id='version-no'
          placeholder=' '
        />
        <label htmlFor='version-no'>Version Number</label>
      </div>
      <button
        onClick={handleUploadCV}
        className='primary-btn'
        disabled={!file || isUploading || !version ? true : false}
      >
        {isUploading ? 'Loading..' : 'Submit CV'}
      </button>
    </>
  )
}

export default CVInput
