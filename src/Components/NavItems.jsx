import React from 'react'
import { NavLink } from 'react-router-dom'
function NavItems({ link, children }) {
  return (
    <NavLink to={link} end>
      {children}
    </NavLink>
  )
}

export default NavItems
