'use client'
function Button({ primary, onClick, children }) {
  return (
    <button
      className={primary ? 'primary-btn' : 'secondary-btn'}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
export default Button
