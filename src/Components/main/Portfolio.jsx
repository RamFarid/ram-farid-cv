import React, { forwardRef } from 'react'
import Section from '../Section'
import WorkCards from '../WorkCards'
import weather from '../../Assets/weather.png'
import qrcode from '../../Assets/qrcode.png'
import logo from '../../Assets/logo.png'
// import portfolio3 from '../../Assets/portfolio3.jpg'
import '../css/portfolio.css'
const Portfolio = forwardRef((props, portfolioRef) => {
  return (
    <Section sub='my works' head='portfolio' id='portfolio' ref={portfolioRef}>
      <div className='portfolio-co'>
        <WorkCards
          title='My CV'
          img={logo}
          website=''
          github='https://github.com/RamFarid/ram-farid-cv'
        >
          <span className='note'>My Website is Fully build with ReactJS</span>
        </WorkCards>
        <WorkCards
          title='Weather App'
          img={weather}
          website='https://welcome0to0rams0server.on.drv.tw/weatherFullUpdateTesting2/'
          github=''
          delay='0.6'
        />
        <WorkCards
          title='QR code generator'
          img={qrcode}
          website='https://welcome0to0rams0server.on.drv.tw/qr-code-generator/'
          github=''
          delay='0.6'
        />
      </div>
      {/*<div className='sub-text' style={{ fontWeight: 700 }}>
        you should know that all of this i made it for fun, but actually no
        projects with clients
      </div>*/}
    </Section>
  )
})

export default Portfolio
