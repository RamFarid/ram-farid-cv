import NewProjectForm from '@/components/Dashboard/NewProjectForm'
import checkToken from '@/lib/auth/checkToken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function NewProject() {
  const token = cookies().get('tooken')?.value.trim()
  if (!token) return redirect('/dashboard/login')
  try {
    await checkToken(token)
    return (
      <>
        <NewProjectForm />
      </>
    )
  } catch (error) {
    return redirect('/dashboard/login')
  }
}
