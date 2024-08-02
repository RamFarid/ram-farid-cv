import EditProjectForm from '@/components/Dashboard/EditProjectForm'
import checkToken from '@/lib/auth/checkToken'
import getProjectByID from '@/utils/getProjectByID'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Project',
}

export const dynamic = 'force-dynamic'

// { imgURL, title, demoURL, githubURL, usages, slug }
export default async function EditProject({ params: { id } }) {
  const token = cookies().get('tooken')?.value.trim()
  try {
    const project = await getProjectByID(id)
    if (!token)
      return <EditProjectForm project={project} id={id} noAccessEdit={true} />
    await checkToken(token)
    if (!project) notFound()
    return (
      <>
        <EditProjectForm project={project} id={id} />
      </>
    )
  } catch (error) {
    if (error.message === 'NEXT_NOT_FOUND') notFound()
    return <EditProjectForm project={project} id={id} noAccessEdit={true} />
  }
}
