import type { Metadata } from 'next'
import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { SignInForm } from '@/components/Console/SignInForm'
import { redirect } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { getSession } from '@/lib/auth/session'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.signIn')
  return { title: t('title') }
}

// A trusted device skips straight to the console. See docs/console.md#sign-in
export default async function SignInPage({ params }: PageProps<'/[locale]/console/sign-in'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  if (await getSession()) redirect({ href: '/console', locale })
  const t = await getTranslations('Console.signIn')

  return (
    <main id="main" className="dot-grid grid min-h-svh place-items-center px-space-4 py-space-8">
      <div className="grid w-full max-w-sm gap-space-6 rounded-lg border border-line bg-surface p-space-6 shadow-md">
        <div className="flex items-center gap-space-3">
          <Image src="/brand/ram-icon.svg" alt="" width={32} height={32} />
          <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-code text-ink-muted">{t('badge')}</span>
        </div>
        <div className="grid gap-space-2">
          <h1 className="text-h2 text-ink">{t('title')}</h1>
          <p className="text-body text-ink-muted">{t('lead')}</p>
        </div>
        <SignInForm />
      </div>
    </main>
  )
}
