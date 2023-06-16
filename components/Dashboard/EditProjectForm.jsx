'use client'
import ImgInput from './ImgInput'
import BackBtn from './BackBtn'
import { useState } from 'react'
import uploadProjectImg from '@/utils/uploadProjectImg'
import { toast } from 'react-toastify'
import editProject from '@/utils/editProject'
import makeSlug from '@/utils/makeSlug'
import { useRouter } from 'next/navigation'

function EditProjectForm({ project, id }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: project.title,
    githubURL: project.githubURL,
    demoURL: project.demoURL,
    usages: project.usages,
  })
  const [otherInline, setOtherInline] = useState(
    project.usages.slice(2).join(',')
  )
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const hanleEditProject = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    let projectH = JSON.parse(JSON.stringify(form))
    const slug = makeSlug(projectH.title)
    projectH['slug'] = slug
    delete projectH.id
    const inline = otherInline.length ? otherInline.split(',') : []
    projectH.usages = projectH.usages.concat(inline)
    try {
      const url = file ? await uploadProjectImg(file, slug) : null
      if (url) projectH['imgURL'] = url
      const done = await editProject(projectH, id)
      if (done) toast.success(`Updated ${id} successfully`)
      router.prefetch('/dashboard')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <form className='form'>
      <BackBtn />
      <div className='title'>Edit project</div>
      <div className='subtitle'>US. Ram Farid</div>
      <div className='inp-co ic1'>
        <input
          id='projectname'
          type='text'
          placeholder=' '
          value={form.title}
          required
          name='projectname'
          onChange={(e) =>
            setForm((pre) => ({ ...pre, title: e.target.value }))
          }
        />
        <label htmlFor='projectname' className='placeholder'>
          Project Name
        </label>
      </div>
      <div className='inp-co ic2'>
        <input
          id='githubUrl'
          type='text'
          placeholder=' '
          value={form.githubURL}
          name='githubUrl'
          onChange={(e) =>
            setForm((pre) => ({ ...pre, githubURL: e.target.value }))
          }
        />
        <label htmlFor='githubUrl' className='placeholder'>
          GitHub Link
        </label>
      </div>
      <div className='inp-co ic2'>
        <input
          id='demoUrl'
          type='text'
          placeholder=' '
          value={form.demoURL}
          name='demoUrl'
          onChange={(e) =>
            setForm((pre) => ({ ...pre, demoURL: e.target.value }))
          }
        />
        <label htmlFor='demoUrl' className='placeholder'>
          Demo Link
        </label>
      </div>
      <ImgInput file={file} setFile={setFile} />
      <div className='inp-co ic2'>
        <h4>Framework</h4>
        <div className='radio-co'>
          <input
            type='radio'
            name='fw'
            id='reactjs'
            defaultChecked={form?.usages?.includes('react')}
            value='react'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [e.target.value, form.usages[1]],
              }))
            }
          />
          <label htmlFor='reactjs'>React js</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='fw'
            id='nextjs'
            defaultChecked={form?.usages?.includes('next')}
            required
            value='next'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [e.target.value, form.usages[1]],
              }))
            }
          />
          <label htmlFor='nextjs'>Next js</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='fw'
            id='pure'
            defaultChecked={form?.usages?.includes('pure')}
            value='pure'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [e.target.value, form.usages[1]],
              }))
            }
          />
          <label htmlFor='pure'>Pure</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='fw'
            id='other1'
            defaultChecked={form?.usages?.includes('other')}
            value='other'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [e.target.value, form.usages[1]],
              }))
            }
          />
          <label htmlFor='other1'>Other</label>
        </div>
        <h4>Styles</h4>
        <div className='radio-co'>
          <input
            type='radio'
            name='styles'
            id='sass'
            defaultChecked={form?.usages?.includes('sass')}
            value='sass'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [form.usages[0], e.target.value],
              }))
            }
          />
          <label htmlFor='sass'>SASS</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='styles'
            id='css'
            defaultChecked={form?.usages?.includes('css')}
            value='css'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [form.usages[0], e.target.value],
              }))
            }
          />
          <label htmlFor='css'>CSS</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='styles'
            id='mui'
            defaultChecked={form?.usages?.includes('mui')}
            value='mui'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [form.usages[0], e.target.value],
              }))
            }
            required
          />
          <label htmlFor='mui'>Material UI</label>
        </div>
        <div className='radio-co'>
          <input
            type='radio'
            name='styles'
            id='other'
            defaultChecked={form?.usages?.includes('other')}
            value='other'
            onChange={(e) =>
              setForm((pre) => ({
                ...pre,
                usages: [form.usages[0], e.target.value],
              }))
            }
            required
          />
          <label htmlFor='other'>Other</label>
        </div>
      </div>
      <div className='inp-co ic2'>
        <input
          id='otherInline'
          type='text'
          placeholder=' '
          value={otherInline}
          name='otherInline'
          onChange={(e) => setOtherInline(e.target.value)}
        />
        <label htmlFor='otherInline' className='placeholder'>
          Others
        </label>
      </div>
      <button
        type='button'
        className='submit primary-btn'
        disabled={isLoading}
        onClick={hanleEditProject}
      >
        {isLoading ? 'Loading...' : 'Save and quit'}
      </button>
    </form>
  )
}

export default EditProjectForm
