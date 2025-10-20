import General from '@/components/Dashboard/General'
import Projects from '@/components/Dashboard/Projects'
import checkToken from '@/lib/auth/checkToken'
import getClientsNo from '@/utils/getClientsNo'
import getProjects from '@/utils/getProjects'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export const metadata = {
  title: 'Ram Farid | Dashboard',
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'only-no-store'

export default async function Dashboard() {
  const token = (await cookies()).get('tooken')?.value.trim()
  console.log('Dashboard: ', token)
  if (!token) return redirect('/dashboard/login')
  try {
    await checkToken(token)
    const [projects, clients] = await Promise.all([
      getProjects(),
      getClientsNo(),
      // getCert(),
    ])
    return (
      <>
        <Projects projects={projects} />
        <hr />
        <General clients={clients} />
      </>
    )
  } catch (error) {
    console.log(error)
    return redirect('/dashboard/login')
  }
}
