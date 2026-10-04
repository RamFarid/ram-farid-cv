import { useTranslations } from 'next-intl'
import { ProjectSlab } from '@/components/Reusable/projects/ProjectSlab'
import { Arrow } from '@/components/ui/Arrow'
import { Container } from '@/components/ui/Container'
import { Link } from '@/i18n/navigation'
import type { ProjectTeaser } from '@/lib/projects/types'

// The next project in console order, in the index's vocabulary: a dark slab and a one-line brief on a violet field.
// The title's link stretches over the whole teaser.
export function NextProject({ project }: { project: ProjectTeaser }) {
  const t = useTranslations('Project')
  const titleId = `next-${project.slug}`

  return (
    <section aria-labelledby="next-title" className="field-violet py-space-8 md:py-space-9">
      <Container className="grid gap-space-6">
        <h2 id="next-title" className="text-h3 text-ink">
          {t('next')}
        </h2>
        <article
          aria-labelledby={titleId}
          className="group relative grid items-center gap-space-6 rounded-lg lg:grid-cols-12 [&:has(a:focus-visible)]:outline-2 [&:has(a:focus-visible)]:outline-offset-4 [&:has(a:focus-visible)]:outline-focus [&:has(a:focus-visible)]:outline-solid"
        >
          <ProjectSlab
            project={project}
            sizes="(min-width: 1200px) 640px, (min-width: 1024px) 55vw, 100vw"
            className="transition-[translate,box-shadow] duration-(--duration-base) ease-out group-hover:-translate-y-0.5 group-hover:shadow-glow motion-reduce:group-hover:translate-y-0 lg:col-span-7"
          />
          <div className="grid justify-items-start gap-space-2 lg:col-span-5">
            <h3 id={titleId} className="text-h2 text-balance text-ink">
              <Link
                href={`/portfolio/${project.slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-lg after:content-['']"
              >
                {project.title}
              </Link>
            </h3>
            <p className="font-mono text-code text-ink tabular-nums">
              {project.kind}
              {project.year && <> · {project.year}</>}
            </p>
            <p className="mt-space-1 max-w-measure text-body-lg text-ink-muted">{project.summary}</p>
            <span aria-hidden className="mt-space-2 inline-flex items-center gap-space-2 text-label text-ink">
              {t('read')}
              <Arrow />
            </span>
          </div>
        </article>
      </Container>
    </section>
  )
}
