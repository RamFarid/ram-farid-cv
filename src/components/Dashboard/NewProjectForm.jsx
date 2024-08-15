'use client'
import { useState } from 'react'
import BackBtn from './BackBtn'
import ImgInput from './ImgsInput'
import { toast } from 'react-toastify'
import addProject from '@/utils/addProject'
import makeSlug from '@/utils/makeSlug'
import { useRouter } from 'next/navigation'
import uploadProjectImgs from '@/utils/uploadProjectImgs'
import MarkDown from '../Portfolio/MarkDown'

function NewProjectForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [gallery, setGallery] = useState([])
  const [thumbnail, setThumbnail] = useState(null)
  const [desc, setDesc] = useState('')
  const router = useRouter()
  const submitNewProject = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const form = new FormData(e.target)
      const imgsURLs = await uploadProjectImgs(
        [thumbnail, ...gallery],
        makeSlug(form.get('projectname'))
      )
      await addProject(form, imgsURLs)
      toast.success(`Added '${form.get('projectname')}' Project successfully`)
      setThumbnail(null)
      setGallery(null)
      router.prefetch('/dashboard')
      router.push('/dashboard')
      e.target.reset()
    } catch (error) {
      toast.error('Error: ' + error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className='form-desc-wrapper'>
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
          <textarea
            id='description'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder=' '
            name='description'
          />
          <label htmlFor='description' className='placeholder'>
            Description
          </label>
        </div>
        <div className='inp-co'>
          <div className='dates-editor'>
            <label htmlFor='startdate'>Start date:</label>
            <label htmlFor='enddate'>End date:</label>
          </div>
          <div className='dates-editor'>
            <input id='startdate' type='date' name='startdate' required />
            <input id='enddate' type='date' name='enddate' required />
          </div>
        </div>
        <ImgInput
          setGallery={setGallery}
          gallery={gallery}
          setThumbnail={setThumbnail}
          thumbnail={thumbnail}
        />
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
            <input type='radio' name='fw' id='otherfw' defaultValue='other' />
            <label htmlFor='otherfw'>Other</label>
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
              id='otherstyles'
              required
              defaultValue='other'
            />
            <label htmlFor='otherstyles'>Other</label>
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
        <div className='radio-co starred'>
          <input type='checkbox' name='starred' id='starred' />
          <label htmlFor='starred'>Starred</label>
        </div>
        <button type='submit' className='submit' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Add project'}
        </button>
      </form>
      <MarkDown desc={desc} />
    </div>
  )
}

export default NewProjectForm
