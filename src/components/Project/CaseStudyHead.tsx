import type { ReactNode } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Tag } from '@/components/ui/Tag'
import { Link } from '@/i18n/navigation'
import { getProjectDuration } from '@/lib/projects'
import type { ProjectCaseStudy } from '@/lib/projects/types'

const monthYear = { month: 'short', year: 'numeric', timeZone: 'UTC' } as const

// The compact head: title and summary on the start side, the facts and the live link on the end side, so the
// screens start above the fold. See docs/portfolio.md#case-study
export function CaseStudyHead({ project }: { project: ProjectCaseStudy }) {
  const t = useTranslations('Project')
  const format = useFormatter()

  const timeline = (() => {
    if (!project.startedAt) return null
    const start = new Date(project.startedAt)
    if (!project.endedAt) return t('ongoing', { start: format.dateTime(start, monthYear) })

    const duration = getProjectDuration(project.startedAt, project.endedAt)
    return (
      <>
        {format.dateTimeRange(start, new Date(project.endedAt), monthYear)}
        <span className="text-ink-muted"> · {t(duration.unit, { count: duration.count })}</span>
      </>
    )
  })()

  const facts: { label: string; value: ReactNode; mono?: boolean }[] = [
    { label: t('facts.client'), value: project.client },
    ...(project.role ? [{ label: t('facts.role'), value: project.role }] : []),
    { label: t('facts.kind'), value: project.kind },
    ...(timeline ? [{ label: t('facts.timeline'), value: timeline, mono: true }] : []),
  ]

  return (
    <header
      className="pt-[calc(var(--nav-height)+var(--space-4)+var(--space-6))] pb-space-6 md:pt-[calc(var(--nav-height)+var(--space-4)+var(--space-8))] md:pb-space-7"
    >
      <Container className="grid gap-space-6 lg:grid-cols-12 lg:gap-space-6">
        <div className="grid content-start gap-space-5 lg:col-span-7">
          <nav aria-label={t('breadcrumb')}>
            <ol className="flex flex-wrap items-center gap-x-space-2 text-small text-ink-muted">
              <li>
                <Link href="/portfolio" className="rounded-sm text-link underline-offset-4 hover:underline">
                  {t('work')}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-ink">
                {project.title}
              </li>
            </ol>
          </nav>
          <h1 id="project-title" className="text-h1 text-balance text-ink md:text-display">
            {project.title}
          </h1>
          <p className="max-w-measure text-body-lg text-ink-muted">{project.summary}</p>
        </div>

        <div className="grid content-start gap-space-5 lg:col-span-4 lg:col-start-9 lg:pt-space-8">
          {/* Under lg the facts sit two to a row with the label above the value, so the screens start sooner on phones. */}
          <dl className="grid grid-cols-2 gap-x-space-4 border-t border-line lg:block">
            {facts.map((fact) => (
              <div key={fact.label} className="grid content-start gap-space-1 border-b border-line py-space-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-space-4">
                <dt className="text-small text-ink-muted">{fact.label}</dt>
                <dd className={fact.mono ? 'font-mono text-code text-ink tabular-nums' : 'text-small text-ink'}>
                  {fact.value}
                </dd>
              </div>
            ))}
            {project.stack.length > 0 && (
              <div className="col-span-2 grid gap-space-3 border-b border-line py-space-3">
                <dt className="text-small text-ink-muted">{t('facts.stack')}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-space-2">
                    {project.stack.map((tech) => (
                      <li key={tech}>
                        <Tag>{tech}</Tag>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>

          {(project.liveUrl || project.repoUrl) && (
            <div className="flex flex-wrap items-center gap-space-2">
              {project.liveUrl && (
                <ButtonLink href={project.liveUrl} external variant="secondary">
                  {t('visit')}
                </ButtonLink>
              )}
              {project.repoUrl && (
                <ButtonLink href={project.repoUrl} external variant="ghost">
                  {t('source')}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
