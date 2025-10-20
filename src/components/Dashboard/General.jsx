import React from 'react'
import Clients from './Clients'
import CVInput from './CVInput'
import Link from 'next/link'
import { BsArrowRight } from 'react-icons/bs'
import SocialLinks from './SocialLinks'

function General({ clients }) {
  return (
    <>
      <h1>General</h1>
      <div style={{ display: 'flex', gap: 12 }}>
        <Clients clientsNo={clients} />
        <SocialLinks />
      </div>
      <hr className='inner-separator' />
      <CVInput />
      <hr className='inner-separator' />
      <Link className='primary-btn messages-btn' href='/dashboard/messages'>
        Go to messages <BsArrowRight />
      </Link>
    </>
  )
}

export default General
