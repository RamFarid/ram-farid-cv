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
  const token = (await cookies()).get('tooken')?.value.trim()
  let project
  try {
    project = await getProjectByID(id)
    if (!project) notFound()
  } catch {
    notFound()
  }
  try {
    if (!token)
      return <EditProjectForm project={project} id={id} noAccessEdit={true} />
    await checkToken(token)
    console.log('object')
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
