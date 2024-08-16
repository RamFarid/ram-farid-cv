function CVBtn({ cvFile }) {
  return (
    <a
      className='secondary-btn'
      href={cvFile}
      download={cvFile}
      target='_blank'
      rel='noreferrer'
    >
      Download Resume
    </a>
  )
}

export default CVBtn
