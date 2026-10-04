import { useTranslations } from 'next-intl'
import { ProjectSlab } from '@/components/Reusable/projects/ProjectSlab'
import { Arrow } from '@/components/ui/Arrow'
import { Link } from '@/i18n/navigation'
import type { ProjectTeaser } from '@/lib/projects/types'

type StripFrameProps = {
  project: ProjectTeaser
  /** 1-based position in console order. */
  position: number
  eager?: boolean
}

// One frame of the film strip: a teaser only (cover, title, kind · year, one sentence). Everything else is the case
// study's. The title's link stretches over the whole frame. See docs/portfolio.md#index
export function StripFrame({ project, position, eager }: StripFrameProps) {
  const t = useTranslations('Portfolio')
  const titleId = `frame-${project.slug}`

  return (
    <li data-frame className="w-(--frame-width) flex-none snap-start">
      <article
        aria-labelledby={titleId}
        className="group relative grid gap-space-5 rounded-lg [&:has(a:focus-visible)]:outline-2 [&:has(a:focus-visible)]:outline-offset-4 [&:has(a:focus-visible)]:outline-focus [&:has(a:focus-visible)]:outline-solid"
      >
        <ProjectSlab
          project={project}
          sizes="(min-width: 1024px) 840px, 84vw"
          eager={eager}
          className="transition-[translate,box-shadow] duration-(--duration-base) ease-out group-hover:-translate-y-0.5 group-hover:shadow-glow motion-reduce:group-hover:translate-y-0"
        />

        <div className="grid justify-items-start gap-space-2">
          <h2 id={titleId} className="text-h2 text-balance text-ink">
            <Link
              href={`/portfolio/${project.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-['']"
            >
              {project.title}
            </Link>
          </h2>
          <p className="font-mono text-code text-ink tabular-nums">
            {String(position).padStart(2, '0')} · {project.kind}
            {project.year && <> · {project.year}</>}
          </p>
          <p className="mt-space-1 max-w-measure text-body-lg text-ink-muted">{project.summary}</p>
          <span aria-hidden className="mt-space-2 inline-flex items-center gap-space-2 text-label text-ink">
            {t('read')}
            <Arrow />
          </span>
        </div>
      </article>
    </li>
  )
}
