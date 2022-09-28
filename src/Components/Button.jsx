import React from 'react'

function Button(props) {
  const { primary, href, onClick } = props
  return (
    <a
      href={href}
      className={primary ? 'primary-btn' : 'secondary-btn'}
      onClick={onClick ? onClick : null}
    >
      {props.children}
    </a>
  )
}
export default Button
