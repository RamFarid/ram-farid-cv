import React from 'react'
import { BsFacebook, BsGithub, BsInstagram } from 'react-icons/bs'
import '../css/footer.css'
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
            <a href='https://github.com/RamFarid'>
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
        </div>
      </div>
    </footer>
  )
}

export default Footer
