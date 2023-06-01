'use client'
import { useId } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'

function ImgInput({ setFile, file }) {
  const id = useId()
  return (
    <div className='inp-co ic2 inp-file-co'>
      <input
        id={id}
        type='file'
        accept='image/*'
        name='imgFile'
        required
        onChange={(e) => setFile(e.target.files[0])}
      />
      <label htmlFor={id} className='placeholder'>
        <AiOutlineCloudUpload color='var(--color-primary)' size={60} />{' '}
        <span>Upload Image</span>
      </label>
      <div className='file-name'>{file?.name}</div>
    </div>
  )
}

export default ImgInput
