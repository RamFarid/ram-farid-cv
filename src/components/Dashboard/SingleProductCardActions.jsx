'use client'

import deleteProject from '@/utils/deleteProject'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'

function SingleProductCardActions({ projectId, slug: imgName }) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <div className='btns-co'>
      <Link href={`/dashboard/project/edit/${projectId}`} passHref>
        <button className='primary-btn'>Edit</button>
      </Link>
      <button
        className='secondary-btn delete-btn'
        disabled={isLoading}
        onClick={async () => {
          try {
            setIsLoading(true)
            const done = await deleteProject(projectId, imgName)
            toast.success('Deleted successfully')
          } catch (error) {
            toast.error(error.message)
            console.log(error)
          } finally {
            setIsLoading(false)
          }
        }}
      >
        {isLoading ? 'Loading...' : 'Delete'}
      </button>
    </div>
  )
}

export default SingleProductCardActions
