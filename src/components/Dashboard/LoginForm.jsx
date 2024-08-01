'use client'

import login from '@/lib/auth/login'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function LoginForm() {
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleLogin = async (e) => {
    const form = e.target
    e.preventDefault()
    try {
      setResponse('')
      setIsLoading(true)
      const res = await login(form.username.value, form.password.value)
      if (res === true) router.push('/dashboard')
      if (res && res !== true) setResponse(res)
    } catch (error) {
      setResponse(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form className='form login-form' onSubmit={handleLogin}>
      <div className='title'>Login</div>
      <div className='subtitle'>required login to access Dashboard</div>
      {response && <div className='alert'>{response}</div>}
      <div className='inp-co'>
        <input
          type='text'
          name='username'
          id='username'
          placeholder=' '
          required
        />
        <label htmlFor='username'>username</label>
      </div>
      <div className='inp-co'>
        <input
          type='password'
          name='password'
          id='password'
          placeholder=' '
          required
        />
        <label htmlFor='password'>Password</label>
      </div>
      <button type='submit' className='submit primary-btn' disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}

export default LoginForm
