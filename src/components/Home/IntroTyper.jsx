'use client'
import Typewriter from 'typewriter-effect'
function IntroTyper() {
  return (
    <span className='my-name'>
      <Typewriter
        options={{
          loop: true,
        }}
        onInit={(typewriter) => {
          typewriter
            .changeDelay(70)
            .pauseFor(2000)
            .changeDeleteSpeed(70)
            .typeString("I'm Ram Farid")
            .pauseFor(1500)
            .changeDeleteSpeed(70)
            .deleteChars(9)
            .pauseFor(900)
            .typeString('Front end developer')
            .changeDeleteSpeed(70)
            .pauseFor(1000)
            .deleteAll()
            .pauseFor(900)
            .typeString('Browse my CV!')
            .pauseFor(2000)
            .start()
        }}
      />
    </span>
  )
}

export default IntroTyper
