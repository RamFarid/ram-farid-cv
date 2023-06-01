import BackBtn from '@/components/Dashboard/BackBtn'
import Messages from '@/components/Dashboard/Messages'
import checkToken from '@/lib/auth/checkToken'
import getMessages from '@/utils/getMessages'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard | Messages',
}

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  // { message, id, time, email, number, name }
  const token = cookies().get('tooken')?.value.trim()
  if (!token) return redirect('/dashboard/login')
  try {
    await checkToken(token)
    const messages = await getMessages()
    return (
      <>
        <BackBtn />
        <Messages messages={messages} />
      </>
    )
  } catch (error) {
    return redirect('/dashboard/login')
  }
}
