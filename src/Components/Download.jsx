import React from 'react'
import resume from '../Assets/Ram_farid_resume.pdf'
function Download() {
  return (
    <a className='secondary-btn' href={resume} download>
      Download Resume
    </a>
  )
}

export default Download
