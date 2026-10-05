import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { CvEditor } from '@/components/Console/Cv/CvEditor'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getCvContacts, getCvSetup } from '@/lib/cv'
import { getYearsOfExperience } from '@/lib/profile'
import { cvContactIds, type CvContactId } from '@/lib/validations/cv'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.cv')
  return { title: t('title') }
}

// The CV setup: what the generated CV takes from the site and how it reads. See docs/cv.md#console
export default async function ConsoleCvPage({ params }: PageProps<'/[locale]/console/cv'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)

  const [{ config, sources }, contacts] = await Promise.all([getCvSetup(), getCvContacts()])
  const contactText = Object.fromEntries(cvContactIds.map((id) => [id, contacts[id]?.text ?? ''])) as Record<CvContactId, string>

  return (
    <CvEditor
      initial={config}
      sources={sources}
      contacts={contactText}
      years={Math.floor(getYearsOfExperience())}
    />
  )
}
