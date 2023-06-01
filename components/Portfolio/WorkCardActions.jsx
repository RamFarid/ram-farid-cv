'use client'
import { toast } from 'react-toastify'
import Button from '../reusables/Button'

function WorkCardActions({ githubURL, title, demoURL }) {
  const detectedGithub = () => {
    if (!githubURL)
      return toast.warning('Sorry, there is no source code for this work')
    window.open(githubURL, '_blank')
  }

  const liveDemoHandler = (e) => {
    if (!demoURL && title.toLowerCase() !== 'my cv') {
      toast.warning("Sorry! The work hasn't been deployed")
      return
    }
    switch (title.toLowerCase()) {
      case 'my cv':
        toast.info('Great! You are already in my CV website')
        return
      default:
        window.open(demoURL, '_blank')
    }
  }
  return (
    <div className='btns-co'>
      <Button primary onClick={liveDemoHandler}>
        Live Show
      </Button>
      <Button onClick={detectedGithub}>Github</Button>
    </div>
  )
}

export default WorkCardActions
