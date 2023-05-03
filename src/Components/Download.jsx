import React from 'react'
import resume from '../Assets/Ram_CV_v9.pdf'
function Download() {
  return (
    <a className='secondary-btn' href={resume} download={`Ram_Farid_CV.pdf`}>
      Download Resume
    </a>
  )
}

export default Download
