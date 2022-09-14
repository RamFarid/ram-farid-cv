import './css/smallCards.css'
function Cards(props) {
  const { icon } = props
  const { head } = props
  const { sub } = props
  return (
    <div className='card'>
      <div className='icon'>{icon}</div>
      <h5>{head}</h5>
      <p className='sub-text'>{sub}</p>
    </div>
  )
}

export default Cards
