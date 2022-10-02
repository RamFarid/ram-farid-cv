import React from 'react'

function NavItems({ link, hashtag, children }) {
  return (
    <a href={link} className={hashtag === link ? 'active' : ''}>
      {children}
    </a>
  )
}

export default NavItems
