import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { EmptyList } from '@/components/Console/ListParts'
import { NewProject } from '@/components/Console/Projects/NewProject'
import { ProjectList } from '@/components/Console/Projects/ProjectList'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getConsoleProjects } from '@/lib/projects/console'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.projects')
  return { title: t('title') }
}

// The projects index: every project in the order the site shows them, with quick actions. See docs/portfolio.md#console
export default async function ConsoleProjectsPage({ params }: PageProps<'/[locale]/console/portfolio'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)
  const [t, projects] = await Promise.all([getTranslations('Console.projects'), getConsoleProjects()])
  const published = projects.filter((project) => project.status === 'published').length

  return (
    <div className="mx-auto max-w-page">
      <header className="flex flex-wrap items-end justify-between gap-space-4 pt-space-7 pb-space-6">
        <div className="grid max-w-measure gap-space-2">
          <h1 className="text-h2 text-ink">{t('title')}</h1>
          <p className="text-body text-ink-muted">
            {t('lead', { published, draft: projects.length - published })}
          </p>
        </div>
        <NewProject />
      </header>

      {projects.length === 0 ? <EmptyList>{t('empty')}</EmptyList> : <ProjectList initial={projects} />}
    </div>
  )
}
