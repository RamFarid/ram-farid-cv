'use client'
function Button({
  primary,
  onClick,
  children,
  startIcon,
  endIcon,
  link,
  href,
  style,
}) {
  if (link)
    return (
      <a
        target='_blank'
        href={href}
        style={style || {}}
        className={primary ? 'primary-btn' : 'secondary-btn'}
      >
        {startIcon}
        {children}
        {endIcon}
      </a>
    )
  return (
    <button
      className={primary ? 'primary-btn' : 'secondary-btn'}
      onClick={onClick}
      style={style || {}}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  )
}
export default Button
