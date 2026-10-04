import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { StackTag } from '@/components/Reusable/projects/StackTag'
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

// One home-page project in a compact band. The violet field is set by the parent section. See docs/home.md
export function ProjectBand({ project, tone, reverse = false, priority }: ProjectBandProps) {
  const t = useTranslations('Home.work')
  const titleId = `project-${project.slug}`

  return (
    <article aria-labelledby={titleId} className="grid items-center gap-space-6 lg:grid-cols-12 lg:gap-space-7">
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
          {project.title}
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

        {project.liveUrl && (
          <ButtonLink href={project.liveUrl} external className="mt-space-2 justify-self-start">
            {t('visit')}
          </ButtonLink>
        )}
      </div>
    </article>
  )
}
