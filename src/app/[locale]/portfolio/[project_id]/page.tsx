import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { CaseStudyHead } from '@/components/Project/CaseStudyHead'
import { CaseStudyStory } from '@/components/Project/CaseStudyStory'
import { NextProject } from '@/components/Project/NextProject'
import { ScreenGallery } from '@/components/Project/ScreenGallery'
import { JsonLd } from '@/components/Reusable/seo/JsonLd'
import { ContactCall } from '@/components/Reusable/site/ContactCall'
import { SiteFooter } from '@/components/Reusable/site/SiteFooter'
import { SiteHeader } from '@/components/Reusable/site/SiteHeader'
import { Container } from '@/components/ui/Container'
import { getCaseStudy, getPublishedProjectSlugs } from '@/lib/projects'
import { absoluteUrl, pageMetadata } from '@/lib/seo/metadata'
import { breadcrumbJsonLd, projectJsonLd } from '@/lib/seo/structured-data'

// Published projects are prerendered; one published after the build renders on its first visit (dynamicParams
// defaults to true), and unknown or draft slugs 404. See docs/portfolio.md#rendering
export const revalidate = 86400

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs()
  return slugs.map((project_id) => ({ project_id }))
}

// generateMetadata and the page share one read per request.
const loadCaseStudy = cache((slug: string, locale: Locale) => getCaseStudy(slug, locale))

export async function generateMetadata({ params }: PageProps<'/[locale]/portfolio/[project_id]'>): Promise<Metadata> {
  const { project_id } = await params
  const locale = await getLocale()
  const caseStudy = await loadCaseStudy(project_id, locale)
  if (!caseStudy) return {}

  const { project } = caseStudy
  const t = await getTranslations('Project.metadata')

  return pageMetadata({
    locale,
    href: `/portfolio/${project.slug}`,
    title: t('title', { title: project.title }),
    description: project.summary,
    image: project.cover,
  })
}

export default async function CaseStudy({ params }: PageProps<'/[locale]/portfolio/[project_id]'>) {
  const { project_id } = await params
  const locale = await getLocale()
  const caseStudy = await loadCaseStudy(project_id, locale)
  if (!caseStudy) notFound()

  const { project, next } = caseStudy
  const [t, tMeta] = await Promise.all([getTranslations('Project'), getTranslations('Metadata')])

  return (
    <>
      <SiteHeader page="portfolio" />
      <main id="main" className="flex-1">
        <article aria-labelledby="project-title">
          <CaseStudyHead project={project} />
          <ScreenGallery project={project} />
          <CaseStudyStory project={project} />
        </article>

        {next && <NextProject project={next} />}

        <section aria-labelledby="contact-call-title" className="dot-grid py-space-9 md:py-space-10">
          <Container>
            <ContactCall headingId="contact-call-title" about="one" />
          </Container>
        </section>

        <JsonLd data={projectJsonLd(project, locale)} />
        <JsonLd
          data={breadcrumbJsonLd([
            { name: tMeta('home'), url: absoluteUrl('/', locale) },
            { name: t('work'), url: absoluteUrl('/portfolio', locale) },
            { name: project.title, url: absoluteUrl(`/portfolio/${project.slug}`, locale) },
          ])}
        />
      </main>
      <SiteFooter />
    </>
  )
}
