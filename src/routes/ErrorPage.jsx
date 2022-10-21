import React from 'react'

import '../Components/css/error.css'
import errorPhoto from '../Assets/error.svg'
import { NavLink } from 'react-router-dom'
import Footer from './Footer'
import usePageTitle from '../hooks/usePageTitle'
function ErrorPage({ title }) {
  usePageTitle(title)
  return (
    <React.Fragment>
      <section className='Error'>
        <img src={errorPhoto} alt='404_not_found' className='Error__photo' />
        <h2>404 page not found!</h2>
        <p>Check to see if the link you are trying to open is valid.</p>
        <NavLink to='/' className='primary-btn'>
          Go to home page
        </NavLink>
      </section>
      <Footer />
    </React.Fragment>
  )
}

export default ErrorPage
