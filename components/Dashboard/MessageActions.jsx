import { AiFillPhone } from 'react-icons/ai'
import { MdEmail } from 'react-icons/md'

function MessageActions({ email, number }) {
  return (
    <>
      <div className='email-icon'>
        <a target='_blank' href={`mailto:${email}`}>
          <MdEmail />
        </a>
      </div>
      <div className='phone-icon'>
        <a
          target='_blank'
          href={`https://api.whatsapp.com/send?phone=2${number}&text=${encodeURIComponent(
            'From your website! \n'
          )}`}
        >
          <AiFillPhone />
        </a>
      </div>
    </>
  )
}

export default MessageActions
