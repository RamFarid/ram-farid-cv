import { useTranslations } from 'next-intl'
import { Arrow } from '@/components/ui/Arrow'
import { ButtonLink, buttonClasses } from '@/components/ui/Button'
import { StackTag } from '@/components/Reusable/projects/StackTag'
import { Link } from '@/i18n/navigation'
import type { PublicProject } from '@/lib/projects/types'
import { cn } from '@/utils'
import { ProjectMedia } from './ProjectMedia'

type ProjectBandProps = {
  project: PublicProject
  tone: 'violet' | 'surface'
  /** Puts the screenshot on the end side, so consecutive bands alternate. */
  reverse?: boolean
  priority?: boolean
}

// One home-page project in a compact band. The violet field is set by the parent section. The title's link to the case
// study stretches over the whole band; only the live-site button sits above it. See docs/home.md#project-bands
export function ProjectBand({ project, tone, reverse = false, priority }: ProjectBandProps) {
  const t = useTranslations('Home.work')
  const titleId = `project-${project.slug}`

  return (
    <article
      aria-labelledby={titleId}
      className="group relative grid items-center gap-space-6 rounded-lg lg:grid-cols-12 lg:gap-space-7 [&:has(a:focus-visible)]:outline-2 [&:has(a:focus-visible)]:outline-offset-8 [&:has(a:focus-visible)]:outline-focus [&:has(a:focus-visible)]:outline-solid"
    >
      <ProjectMedia
        project={project}
        tone={tone}
        priority={priority}
        className={cn('lg:col-span-6', reverse && 'lg:order-last')}
      />

      <div className="grid content-start gap-space-4 lg:col-span-6">
        <p className="font-mono text-eyebrow text-ink-muted uppercase">
          {project.kind}
          {project.year && <span className="tabular-nums"> · {project.year}</span>}
        </p>
        <h3 id={titleId} className="text-h2 text-balance text-ink">
          <Link
            href={`/portfolio/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-['']"
          >
            {project.title}
          </Link>
        </h3>
        <p className="max-w-measure text-body-lg text-ink-muted">{project.summary}</p>

        <dl className="grid gap-space-3 border-t border-line pt-space-4">
          <div className="flex flex-wrap gap-x-space-3 gap-y-space-1">
            <dt className="text-small text-ink-muted">{t('client')}</dt>
            <dd className="text-small text-ink">{project.client}</dd>
          </div>
          {project.stack.length > 0 && (
            <div className="grid gap-space-2">
              <dt className="sr-only">{t('stack')}</dt>
              <dd>
                <ul className="flex flex-wrap gap-space-2">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <StackTag id={tech} />
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-space-2 flex flex-wrap items-center gap-space-3">
          {/* The stretched title link makes this clickable; it's a cue, so it stays out of the Tab order and the accessibility tree. */}
          <span aria-hidden className={buttonClasses({ variant: 'primary' })}>
            {t('read')}
            <Arrow />
          </span>
          {project.liveUrl && (
            <ButtonLink href={project.liveUrl} external variant="secondary" className="relative z-10">
              {t('visit')}
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  )
}
