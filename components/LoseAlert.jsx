'use client'
import { IoIosWarning } from 'react-icons/io'
import { BsFillEmojiLaughingFill } from 'react-icons/bs'
import { RxCross2 } from 'react-icons/rx'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
function LoseAlert() {
  const [show, setShow] = useState(true)
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className='lose-alert'
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          <div className='ico'>
            <IoIosWarning
              size={30}
              color='var(--error-color)'
              stroke='#fff'
              strokeWidth={9}
            />
          </div>
          <p>
            Unfortunately, {"I'm"} <b>very busy</b> this period of time due to
            my academic studies, I avaliable only for{' '}
            <b>short-time tasks/projects</b>, {"I'll"} be avaliable for work by
            ending of this year approx in August 2024. <br />
            Thanks for understanding <BsFillEmojiLaughingFill />
          </p>
          <button
            onClick={() => {
              setShow(false)
            }}
          >
            <RxCross2 />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default LoseAlert
