import { useTranslations } from 'next-intl'
import { Arrow } from '@/components/ui/Arrow'
import { Link } from '@/i18n/navigation'
import type { ProjectTeaser } from '@/lib/projects/types'
import { cn } from '@/utils'

// Every project as one ruled row (number, title, year), for jumping straight to a case study without the rail.
export function ProjectContents({ projects, className }: { projects: ProjectTeaser[]; className?: string }) {
  const t = useTranslations('Portfolio')

  return (
    <section aria-labelledby="contents-title" className={cn('grid content-start gap-space-5', className)}>
      <h2 id="contents-title" className="text-h3 text-ink">
        {t('contents')}
      </h2>
      <ol className="border-t border-line">
        {projects.map((project, index) => (
          <li key={project.slug} className="border-b border-line">
            <Link
              href={`/portfolio/${project.slug}`}
              className="group grid grid-cols-[3ch_1fr_auto_auto] items-center gap-x-space-4 rounded-sm px-space-2 py-space-4 transition-colors hover:bg-surface-raised"
            >
              <span className="font-mono text-code text-ink-muted tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-body-lg font-normal text-ink">{project.title}</span>
              <span className="font-mono text-code text-ink-muted tabular-nums">{project.year}</span>
              <Arrow className="text-ink-muted group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
