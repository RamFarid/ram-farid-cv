import '@/styles/smallCards.css'
function SmallCards({ icon, head, sub }) {
  return (
    <div className='card'>
      <div className='icon'>{icon}</div>
      <h5>{head}</h5>
      <p className='sub-text'>{sub}</p>
    </div>
  )
}

export default SmallCards
