import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { AboutSection } from '@/components/Console/Home/AboutSection'
import { CertificationsSection } from '@/components/Console/Home/CertificationsSection'
import { ExperienceSection } from '@/components/Console/Home/ExperienceSection'
import { ServicesSection } from '@/components/Console/Home/ServicesSection'
import { SkillsSection } from '@/components/Console/Home/SkillsSection'
import { ButtonLink } from '@/components/ui/Button'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getConsoleHomeContent } from '@/lib/home'
import { careerStart, getYearsOfExperience } from '@/lib/profile'
import { getPublishedProjectCount } from '@/lib/projects'
import { getConsoleProjects } from '@/lib/projects/console'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.home')
  return { title: t('title') }
}

// The console's main page: the home page's editable content, one panel per section in home-page order.
// See docs/console.md#home-content
export default async function ConsoleHomePage({ params }: PageProps<'/[locale]/console'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)

  const [t, format, content, projectCount, projects] = await Promise.all([
    getTranslations('Console.home'),
    getFormatter(),
    getConsoleHomeContent(),
    getPublishedProjectCount(),
    getConsoleProjects(),
  ])
  const since = format.dateTime(careerStart, { month: 'long', year: 'numeric', timeZone: 'UTC' })

  return (
    <div className="mx-auto max-w-page">
      <header className="flex flex-wrap items-end justify-between gap-space-4 pt-space-7 pb-space-6">
        <div className="grid max-w-measure gap-space-2">
          <h1 className="text-h2 text-ink">{t('title')}</h1>
          <p className="text-body text-ink-muted">{t('lead')}</p>
        </div>
        <ButtonLink href={`/${locale}`} external variant="secondary" size="sm">
          {t('viewLive')}
        </ButtonLink>
      </header>

      <AboutSection initial={content.about} projectCount={projectCount} years={getYearsOfExperience()} since={since} />
      <ExperienceSection
        initial={{ experience: content.experience }}
        projects={projects.map((project) => ({ id: project.id, title: project.title[locale] || project.title.en || project.slug }))}
      />
      <ServicesSection initial={{ services: content.services }} />
      <SkillsSection initial={{ skillGroups: content.skillGroups }} />
      <CertificationsSection initial={{ certifications: content.certifications }} />
    </div>
  )
}
