import React, { useState, useEffect, useRef } from 'react'
import Home from './Components/main/Home'
import About from './Components/main/About'
import Experience from './Components/main/Experience'
import Services from './Components/main/Services'
import Portfolio from './Components/main/Portfolio'
import Contact from './Components/main/Contact'
import Footer from './Components/main/Footer'
import Testmonials from './Components/main/Testmonials'
function App() {
  const [hashtag, setHashtag] = useState('#home')
  const homeRef = useRef()
  const aboutRef = useRef()
  const experienceRef = useRef()
  const servicesRef = useRef()
  const portfolioRef = useRef()
  const contactRef = useRef()
  const testmonialsRef = useRef()
  useEffect(() => {
    function handleScroll(event) {
      if (window.scrollY >= contactRef.current.offsetTop - 250) {
        setHashtag('#contact-me')
      } else if (window.scrollY >= testmonialsRef.current.offsetTop - 250) {
        setHashtag('#testmonials')
      } else if (window.scrollY >= portfolioRef.current.offsetTop - 250) {
        setHashtag('#portfolio')
      } else if (window.scrollY >= servicesRef.current.offsetTop - 250) {
        setHashtag('#services')
      } else if (window.scrollY >= experienceRef.current.offsetTop - 250) {
        setHashtag('#experience')
      } else if (window.scrollY >= aboutRef.current.offsetTop - 250) {
        setHashtag('#about')
      } else if (window.scrollY >= homeRef.current.offsetTop - 250) {
        setHashtag('#home')
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <div className='App'>
      <div className='container'>
        <Home hash={hashtag} setHashtag={setHashtag} ref={homeRef} />
        <About ref={aboutRef} />
        <Experience ref={experienceRef} />
        <Services ref={servicesRef} />
        <Portfolio ref={portfolioRef} />
        <Testmonials ref={testmonialsRef} />
        <Contact ref={contactRef} />
      </div>
      <Footer />
    </div>
  )
}

export default App
