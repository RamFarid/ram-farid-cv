import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import type { ProjectCaseStudy } from '@/lib/projects/types'

function StoryRow({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-space-4 border-t border-line py-space-7 first:border-t-0 lg:grid-cols-12 lg:gap-space-6">
      <h2 id={id} className="text-h3 text-balance text-ink lg:col-span-4">
        {title}
      </h2>
      <div className="max-w-measure lg:col-span-8">{children}</div>
    </section>
  )
}

// The case study's words, in ruled rows: a heading on the start side, the text at reading measure on the end side.
// The story is sanitized HTML from the console, rendered as-is. See docs/portfolio.md#story-html
export function CaseStudyStory({ project }: { project: ProjectCaseStudy }) {
  const t = useTranslations('Project')
  const paragraphs = project.overview?.split(/\n\s*\n/).filter(Boolean) ?? []

  if (!paragraphs.length && !project.deliverables.length && !project.storyHtml) return null

  return (
    <div className="pb-space-8 md:pb-space-9">
      <Container>
        {paragraphs.length > 0 && (
          <StoryRow id="overview-title" title={t('overview')}>
            <div className="grid gap-space-4 text-body-lg text-ink">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </StoryRow>
        )}

        {project.deliverables.length > 0 && (
          <StoryRow id="deliverables-title" title={t('deliverables')}>
            <ul className="border-t border-line">
              {project.deliverables.map((deliverable) => (
                <li key={deliverable} className="border-b border-line py-space-3 text-body text-ink">
                  {deliverable}
                </li>
              ))}
            </ul>
          </StoryRow>
        )}

        {project.storyHtml && (
          <StoryRow id="story-title" title={t('story')}>
            <div className="story-prose" dangerouslySetInnerHTML={{ __html: project.storyHtml }} />
          </StoryRow>
        )}
      </Container>
    </div>
  )
}
