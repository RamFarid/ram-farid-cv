import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ProjectEditor } from '@/components/Console/Projects/ProjectEditor'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getConsoleProject } from '@/lib/projects/console'

export async function generateMetadata({ params }: PageProps<'/[locale]/console/portfolio/[project_id]'>): Promise<Metadata> {
  const { locale, project_id } = await params
  const [t, project] = await Promise.all([getTranslations('Console.project'), getConsoleProject(project_id)])
  if (!project || !hasLocale(routing.locales, locale)) return {}
  return { title: t('titleFrom', { title: project.input.title[locale] || project.input.title.en }) }
}

// One project's edit page. `project_id` is the database id, so the address survives a slug change.
// See docs/portfolio.md#console
export default async function ConsoleProjectPage({ params }: PageProps<'/[locale]/console/portfolio/[project_id]'>) {
  const { locale, project_id } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)
  const project = await getConsoleProject(project_id)
  if (!project) notFound()

  // Keyed by id so moving between projects starts a fresh draft.
  return <ProjectEditor key={project.id} project={project} />
}
