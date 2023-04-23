import React, { useState } from 'react'

// import use components
import Section from '../Components/Section'
import SmallCards from '../Components/SmallCards'

// import icons
import { BsMessenger, BsWhatsapp } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

// import email modul
import emailjs from '@emailjs/browser'
import Loading from '../Components/Loading'
// import { success, error } from '../toastingMsgs'

// import style
import '../Components/css/contact.css'
import usePageTitle from '../hooks/usePageTitle'
import { toast } from 'react-toastify'

import { AiFillLinkedin } from 'react-icons/ai'

const Contact = ({ title }) => {
  const [loading, setLoading] = useState(false)
  usePageTitle(title)
  const sendMsg = (e) => {
    setLoading(true)
    e.preventDefault()
    const sendMsg = emailjs
      .send(
        'service_3nm6s4c',
        'template_prri59z',
        {
          name: e.target.name.value,
          tel: e.target.tel.value,
          email: e.target.email.value,
          msg: e.target.msg.value,
        },
        'g3uAsxNxP3mh6Ixsj'
      )
      .finally(() => {
        e.target.reset()
        setLoading(false)
      })
    toast.promise(sendMsg, {
      pending: 'Sending message...',
      error: 'Sorry! Something went wrong, Try contact me on social accounts',
      success: 'Thanks for contact me!',
    })
  }

  return (
    <Section sub='get in touch' head='contact me'>
      <div className='contact-co mb-sections'>
        <div className='cards-side'>
          <SmallCards
            icon={<AiFillLinkedin />}
            head='LinkidIn'
            sub={
              <a
                href='https://www.linkedin.com/in/ram-farid-2a6760273'
                target='_blank'
                rel='noreferrer'
              >
                ram-farid-2a6760273
              </a>
            }
          />
          <SmallCards
            icon={<MdEmail />}
            head='Gmail'
            sub={
              <>
                <a
                  href='mailto:workprojects22@gmail.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  workprojects22@gmail.com
                </a>
                <br />
                <a
                  href='mailto:ramfarid3@gmail.com'
                  target='_blank'
                  rel='noreferrer'
                >
                  ramfarid3@gmail.com
                </a>
              </>
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
          <SmallCards
            icon={<BsMessenger />}
            head='messenger'
            sub={
              <a href='https://m.me/rraaamm_s' target='_blank' rel='noreferrer'>
                rraaamm_s
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
                required
              />
              <label htmlFor='tel'>Phone number</label>
            </div>
            <div className='inp-co'>
              <textarea
                name='msg'
                id='msg'
                placeholder=' '
                required
                dir='auto'
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
    </Section>
  )
}

export default Contact
