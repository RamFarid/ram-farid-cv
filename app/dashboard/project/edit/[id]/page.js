import EditProjectForm from '@/components/Dashboard/EditProjectForm'
import checkToken from '@/lib/auth/checkToken'
import getProjectByID from '@/utils/getProjectByID'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | Edit',
}

export const dynamic = 'force-dynamic'

// { imgURL, title, demoURL, githubURL, usages, slug }
export default async function EditProject({ params: { id } }) {
  const token = cookies().get('tooken')?.value.trim()
  if (!token) return redirect('/dashboard/login')
  try {
    await checkToken(token)
    const project = await getProjectByID(id)
    if (!project) return notFound()
    return (
      <>
        <EditProjectForm project={project} id={id} />
      </>
    )
  } catch (error) {
    return redirect('/dashboard/login')
  }
}
