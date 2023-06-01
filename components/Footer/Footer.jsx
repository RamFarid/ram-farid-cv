import React from 'react'
import {
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsMessenger,
  BsVoicemail,
  BsWhatsapp,
} from 'react-icons/bs'
function Footer() {
  return (
    <footer>
      <div className='top'>
        <div>
          <div className='copyrights'>
            Copyright
            <sup>&copy; </sup>
            {new Date().getFullYear()} Ram Farid
          </div>
          <div className='signature'>
            Designed, made, and deployed by <span>Ram Farid</span>
          </div>
        </div>
        <div className='links'>
          <div className='link-co'>
            <a
              href='https://github.com/RamFarid'
              target='_blank'
              rel='noreferrer'
            >
              <BsGithub />
            </a>
          </div>
          <div className='link-co'>
            <a
              href='https://facebook.com/rraaamm_s'
              target='_blank'
              rel='noreferrer'
            >
              <BsFacebook />
            </a>
          </div>
          <div className='link-co'>
            <a
              href='https://www.instagram.com/ramfarid_s/'
              target='_blank'
              rel='noreferrer'
            >
              <BsInstagram />
            </a>
          </div>
          <div className='link-co'>
            <a href='https://m.me/rraaamm_s' target='_blank' rel='noreferrer'>
              <BsMessenger />
            </a>
          </div>
          <div className='link-co'>
            <a
              href='mailto:workprojects22@gmail.com'
              target='_blank'
              rel='noreferrer'
            >
              <BsVoicemail />
            </a>
          </div>
          <div className='link-co'>
            <a
              href='https://api.whatsapp.com/send?phone=201553706448&text=Welcome%20from%20your%20website!'
              target='_blank'
              rel='noreferrer'
            >
              <BsWhatsapp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
