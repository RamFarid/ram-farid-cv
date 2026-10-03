import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { PublicProject } from '@/lib/projects/types'
import { cn } from '@/utils'
import { ProjectBand } from './ProjectBand'

// The first published projects by console order, one compact band each (the first on a violet field), then the way to the rest.
// See docs/decisions.md ("Home page: the first two projects by order, then /portfolio")
export function Work({ projects }: { projects: PublicProject[] }) {
  const t = useTranslations('Home.work')
  if (projects.length === 0) return null

  return (
    <section id="work" aria-labelledby="work-title">
      {projects.map((project, index) => {
        const tone = index % 2 === 0 ? 'violet' : 'surface'

        return (
          <div
            key={project.slug}
            className={cn(
              'overflow-clip py-space-8',
              tone === 'violet' ? 'field-violet' : 'border-y border-line bg-surface',
            )}
          >
            <Container className="grid gap-space-6">
              {index === 0 && (
                <div className="flex flex-wrap items-end justify-between gap-space-5">
                  <SectionHeading id="work-title" index="01" eyebrow={t('eyebrow')} title={t('title')} />
                  <ButtonLink href="/portfolio" variant="secondary" size="sm" arrow>
                    {t('all')}
                  </ButtonLink>
                </div>
              )}
              <ProjectBand project={project} tone={tone} reverse={index % 2 === 1} priority={index === 0} />
            </Container>
          </div>
        )
      })}
    </section>
  )
}
