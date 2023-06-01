import Link from 'next/link'

function AddProjectBtn() {
  return (
    <Link className='secondary-btn' href='/dashboard/project/new'>
      Add new
    </Link>
  )
}

export default AddProjectBtn
