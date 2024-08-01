'use client'
import ReactAvatar from 'react-avatar'

function Avatar({ name }) {
  return (
    <ReactAvatar
      name={name || 'Ram Farid'}
      round
      size='64'
      color='rgba(77, 181, 255, 0.4)'
    />
  )
}

export default Avatar
