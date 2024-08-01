'use client'
import Typewriter from 'typewriter-effect'
function WelcomeTyper() {
  return (
    <span className='hello'>
      <Typewriter
        options={{
          cursor: ' ',
        }}
        onInit={(typewriter) => {
          typewriter.typeString('Welcome,').start()
        }}
      />
    </span>
  )
}

export default WelcomeTyper
