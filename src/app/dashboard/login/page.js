import LoginForm from '@/components/Dashboard/LoginForm'
import checkToken from '@/lib/auth/checkToken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const token = (await cookies()).get('tooken')?.value.trim()
  console.log('Login: ', token)

  if (!token) return <LoginForm />
  try {
    await checkToken(token)
    redirect('/dashboard')
  } catch (error) {
    if (error.message === 'NEXT_REDIRECT') return redirect('/dashboard')
    return <LoginForm />
  }
}
