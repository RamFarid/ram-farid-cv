'use client'
import { useState } from 'react'
import BackBtn from './BackBtn'
import ImgInput from './ImgInput'
import { toast } from 'react-toastify'
import addProject from '@/utils/addProject'
import uploadProjectImg from '@/utils/uploadProjectImg'
import makeSlug from '@/utils/makeSlug'
import { useRouter } from 'next/navigation'

function NewProjectForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const router = useRouter()
  const submitNewProject = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const form = new FormData(e.target)
      const imgURL = await uploadProjectImg(
        file,
        makeSlug(form.get('projectname'))
      )
      await addProject(form, imgURL)
      toast.success(`Added '${form.get('projectname')}' Project successfully`)
      router.prefetch('/dashboard')
      router.push('/dashboard')
      e.target.reset()
    } catch (error) {
      toast.error('Error: ', error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
      setFile(null)
    }
  }
  return (
    <form className='form' onSubmit={submitNewProject}>
      <BackBtn />
      <div className='title'>Add new project</div>
      <div className='subtitle'>US. Ram Farid</div>
      <div className='inp-co ic1'>
        <input
          id='projectname'
          name='projectname'
          type='text'
          placeholder=' '
          required
        />
        <label htmlFor='projectname' className='placeholder'>
          Project Name
        </label>
      </div>
      <div className='inp-co ic2'>
        <input id='githubUrl' type='text' placeholder=' ' name='githubUrl' />
        <label htmlFor='githubUrl' className='placeholder'>
          GitHub Link
        </label>
      </div>
      <div className='inp-co ic2'>
        <input id='demoUrl' name='demoUrl' type='text' placeholder=' ' />
        <label htmlFor='demoUrl' className='placeholder'>
          Demo Link
        </label>
      </div>
      <div className='inp-co ic2'>
        <textarea id='description' placeholder=' ' name='description' />
        <label htmlFor='description' className='placeholder'>
          Description
        </label>
      </div>
      <ImgInput setFile={setFile} file={file} />
      <div className='inp-co ic2'>
        <h4>Framework</h4>
        <div className='radio-co'>
          <input type='radio' name='fw' id='reactjs' defaultValue='react' />
          <label htmlFor='reactjs'>React js</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='fw'
            id='nextjs'
            defaultValue='next'
            required
          />
          <label htmlFor='nextjs'>Next js</label>
        </div>
        <div className='radio-co'>
          <input type='radio' name='fw' id='pure' defaultValue='pure' />
          <label htmlFor='pure'>Pure</label>
        </div>
        <div className='radio-co'>
          <input type='radio' name='fw' id='other' defaultValue='other' />
          <label htmlFor='other'>Other</label>
        </div>
        <h4>Styles</h4>
        <div className='radio-co'>
          <input type='radio' name='styles' id='sass' defaultValue='sass' />
          <label htmlFor='sass'>SASS</label>
        </div>
        <div className='radio-co'>
          <input type='radio' name='styles' id='css' defaultValue='css' />
          <label htmlFor='css'>CSS</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='styles'
            id='mui'
            required
            defaultValue='mui'
          />
          <label htmlFor='mui'>Material UI</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='styles'
            id='other'
            required
            defaultValue='other'
          />
          <label htmlFor='other'>Other</label>
        </div>
      </div>
      <div className='inp-co ic2'>
        <input
          id='otherInline'
          type='text'
          placeholder=' '
          defaultValue={''}
          name='otherInline'
        />
        <label htmlFor='otherInline' className='placeholder'>
          Others
        </label>
      </div>
      <button type='submit' className='submit' disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Add project'}
      </button>
    </form>
  )
}

export default NewProjectForm
