import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.projects')
  return { title: t('title') }
}

// Placeholder until its phase is built (docs/console.md#phases); the rail already links here.
export default async function Page({ params }: PageProps<'/[locale]/console/portfolio'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)
  const t = await getTranslations('Console.projects')

  return (
    <div className="mx-auto grid max-w-page gap-space-2 pt-space-7">
      <h1 className="text-h2 text-ink">{t('title')}</h1>
      <p className="max-w-measure text-body text-ink-muted">{t('soon')}</p>
    </div>
  )
}
