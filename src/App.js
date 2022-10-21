import React from 'react'

import Footer from './routes/Footer'

// Import router-dom
import { Outlet } from 'react-router-dom'

import Nav from './routes/Nav'

import { ToastContainer } from 'react-toastify'

// import Scroll top provider
import ScrollToTop from './ScrollToTop'

function App() {
  return (
    <React.StrictMode>
      <div className='App'>
        <div className='container'>{<Outlet />}</div>
        <Nav />
        <Footer />
        <ToastContainer />
      </div>
      <ScrollToTop />
    </React.StrictMode>
  )
}

// <Home hashtag={hashtag} ref={homeRef} />
// <About ref={aboutRef} />
//           <Experience ref={experienceRef} />
//           <Services ref={servicesRef} />
//           <Portfolio ref={portfolioRef} />
//           <Testmonials ref={testmonialsRef} />
//           <Contact ref={contactRef} />
// useEffect(() => {
//   function handleScroll(event) {
//     if (window.scrollY >= contactRef.current.offsetTop - 250) {
//       setHashtag('#contact-me')
//     } else if (window.scrollY >= testmonialsRef.current.offsetTop - 250) {
//       setHashtag('#testmonials')
//     } else if (window.scrollY >= portfolioRef.current.offsetTop - 250) {
//       setHashtag('#portfolio')
//     } else if (window.scrollY >= servicesRef.current.offsetTop - 250) {
//       setHashtag('#services')
//     } else if (window.scrollY >= experienceRef.current.offsetTop - 250) {
//       setHashtag('#experience')
//     } else if (window.scrollY >= aboutRef.current.offsetTop - 250) {
//       setHashtag('#about')
//     } else if (window.scrollY >= homeRef.current.offsetTop - 250) {
//       setHashtag('#home')
//     }
//   }

//   window.addEventListener('scroll', handleScroll)

//   return () => {
//     window.removeEventListener('scroll', handleScroll)
//   }
// }, [])

// const [hashtag, setHashtag] = useState('#home')
// const homeRef = useRef()
// const aboutRef = useRef()
// const experienceRef = useRef()
// const servicesRef = useRef()
// const portfolioRef = useRef()
// const contactRef = useRef()
// const testmonialsRef = useRef()
export default App
