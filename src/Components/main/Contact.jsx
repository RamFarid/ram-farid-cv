import React, { useRef, useState, forwardRef } from 'react'
import Section from '../Section'
import { BsMessenger, BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import SmallCards from '../SmallCards'
import emailjs from '@emailjs/browser'
import '../css/contact.css'
import Loading from '../Loading'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import Keyboard Hook

const Contact = forwardRef((props, contactRef) => {
  const [loading, setLoading] = useState(false)
  const telRef = useRef()
  const nameRef = useRef()
  const emailRef = useRef()
  const msgRef = useRef()
  const sendMsg = (e) => {
    setLoading(true)
    e.preventDefault()
    emailjs
      .send(
        'service_3nm6s4c',
        'template_prri59z',
        {
          name: nameRef.current.value,
          tel: telRef.current.value,
          email: emailRef.current.value,
          msg: msgRef.current.value,
        },
        'g3uAsxNxP3mh6Ixsj'
      )
      .then(
        (response) => {
          if (response.status === 200) {
            setLoading(false)
            toast.success('Thanks for contact me!', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            })
            e.target.reset()
          }
        },
        (error) => {
          if (error.status === 400) {
            setLoading(false)
            toast.error(
              'Sorry! technical problem happend, Try contact me on socil media',
              {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
              }
            )
            e.target.reset()
          }
          if (error.status === 0) {
            setLoading(false)
            toast.error('No internet connection', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            })
            e.target.reset()
          }
        }
      )
  }
  return (
    <Section
      sub='get in touch'
      head='contact me'
      id='contact-me'
      ref={contactRef}
    >
      <div className='contact-co'>
        <div className='cards-side'>
          <SmallCards
            icon={<BsMessenger />}
            head='messenger'
            sub={
              <a href='https://m.me/rraaamm_s' target='_blank' rel='noreferrer'>
                rraaamm_s
              </a>
            }
          />
          <SmallCards
            icon={<MdEmail />}
            head='Gmail'
            sub={
              <a
                href='mailto:ramfarid3@gmail.com'
                target='_blank'
                rel='noreferrer'
              >
                ramfarid3@gmail.com
              </a>
            }
          />
          <SmallCards
            icon={<BsWhatsapp />}
            head='WhatsApp'
            sub={
              <a
                href='https://api.whatsapp.com/send?phone=201553706448&text=Welcome from your website!'
                target='_blank'
                rel='noreferrer'
              >
                +201553706448
              </a>
            }
          />
        </div>
        <div className='contact-side'>
          <form id='contact-form' onSubmit={sendMsg}>
            <div className='inp-co'>
              <input
                type='text'
                name='name'
                id='name'
                autoComplete='off'
                placeholder=' '
                ref={nameRef}
                required
              />
              <label htmlFor='name'>Your full name</label>
            </div>
            <div className='inp-co'>
              <input
                type='email'
                name='email'
                id='email'
                autoComplete='off'
                placeholder=' '
                ref={emailRef}
                required
              />
              <label htmlFor='email'>Email</label>
            </div>
            <div className='inp-co'>
              <input
                type='tel'
                name='tel'
                id='tel'
                autoComplete='off'
                placeholder=' '
                ref={telRef}
                required
              />
              <label htmlFor='tel'>Phone number</label>
            </div>
            <div className='inp-co'>
              <textarea
                name='msg'
                id='msg'
                placeholder=' '
                ref={msgRef}
                required
              />
              <label htmlFor='msg'>Your message</label>
            </div>
            <button type='submit' className='primary-btn'>
              Send
            </button>
            {loading && <Loading />}
          </form>
        </div>
      </div>
      <ToastContainer />
    </Section>
  )
})

export default Contact
