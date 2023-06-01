import SingleMessage from './SingleMessage'

function Messages({ messages }) {
  return (
    <div
      className='messages'
      style={{
        marginTop: 30,
      }}
    >
      <h1>Messages</h1>
      {messages.length ? (
        messages.map((message) => (
          <SingleMessage key={message.id} {...message} />
        ))
      ) : (
        <h2>No Messages!</h2>
      )}
    </div>
  )
}

export default Messages
