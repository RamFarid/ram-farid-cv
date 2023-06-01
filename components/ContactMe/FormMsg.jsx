'use client'
import sendMsg from '@/utils/sendMsg'
import Loading from '../Skeletons/SpinnerLoader'
import { useState } from 'react'
import { toast } from 'react-toastify'

function FormMsg() {
  const [isLoading, setIsLoading] = useState(false)
  const submitMsg = async (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    setIsLoading(true)
    try {
      await sendMsg(form)
      toast.success(
        'Thanks for contact us! We will reply to you within 12 hours.'
      )
    } catch (error) {
      toast.error(error)
    } finally {
      setIsLoading(false)
      e.target.reset()
    }
  }
  return (
    <div className='contact-side'>
      <form id='contact-form' onSubmit={submitMsg}>
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
          <textarea name='msg' id='msg' placeholder=' ' required dir='auto' />
          <label htmlFor='msg'>Your message</label>
        </div>
        <button type='submit' className='primary-btn' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
        {isLoading && <Loading />}
      </form>
    </div>
  )
}

export default FormMsg
