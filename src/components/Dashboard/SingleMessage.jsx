import Avatar from './Avatar'
import MessageActions from './MessageActions'

function SingleMessage({ message, id, time, email, number, name }) {
  const date = time.toDate()
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  const formattedDate = date.toLocaleString('en-US', options)
  return (
    <figure id={id}>
      <Avatar name={name} />
      <figcaption>
        <div className='title-wrapper'>
          <h3>{name}</h3>
          <div className='time'>{formattedDate}</div>
        </div>
        <MessageActions email={email} number={number} />
        <p>{message}</p>
      </figcaption>
    </figure>
  )
}

export default SingleMessage
