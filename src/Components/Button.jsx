import React from 'react'

function Button(props) {
  const { primary } = props
  const { onClick } = props
  const { href } = props
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
