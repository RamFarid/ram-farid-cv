import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { FilmStrip } from '@/components/Portfolio/FilmStrip'
import { PortfolioHead, PortfolioIntro, ProjectCount } from '@/components/Portfolio/PortfolioIntro'
import { ProjectContents } from '@/components/Portfolio/ProjectContents'
import { StripFrame } from '@/components/Portfolio/StripFrame'
import { JsonLd } from '@/components/Reusable/seo/JsonLd'
import { ContactCall } from '@/components/Reusable/site/ContactCall'
import { SiteFooter } from '@/components/Reusable/site/SiteFooter'
import { SiteHeader } from '@/components/Reusable/site/SiteHeader'
import { Container } from '@/components/ui/Container'
import { getPortfolioProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/seo/metadata'
import { portfolioJsonLd } from '@/lib/seo/structured-data'

// Static like the home page, regenerated daily; the console will revalidate on project changes. See docs/portfolio.md#rendering
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('Portfolio.metadata')

  return pageMetadata({ locale, href: '/portfolio', title: t('title'), description: t('description') })
}

export default async function Portfolio() {
  const locale = await getLocale()
  const [projects, t] = await Promise.all([getPortfolioProjects(locale), getTranslations('Portfolio')])

  return (
    <>
      <SiteHeader page="portfolio" />
      <main id="main" className="flex-1">
        {projects.length > 0 ? (
          <FilmStrip
            count={projects.length}
            intro={<PortfolioIntro />}
            summary={<ProjectCount count={projects.length} />}
          >
            {projects.map((project, index) => (
              <StripFrame key={project.slug} project={project} position={index + 1} eager={index === 0} />
            ))}
          </FilmStrip>
        ) : (
          <>
            <PortfolioHead>
              <div className="lg:col-span-8">
                <PortfolioIntro />
              </div>
            </PortfolioHead>
            <Container>
              <p className="border-y border-line py-space-7 text-body-lg text-ink-muted">{t('empty')}</p>
            </Container>
          </>
        )}

        <div className="py-space-8 md:py-space-9">
          <Container className="grid gap-space-8 lg:grid-cols-12 lg:gap-space-6">
            {projects.length > 0 && <ProjectContents projects={projects} className="lg:col-span-7" />}
            <section aria-labelledby="contact-call-title" className="lg:col-span-4 lg:col-start-9">
              <ContactCall headingId="contact-call-title" />
            </section>
          </Container>
        </div>

        <JsonLd
          data={portfolioJsonLd({
            locale,
            name: t('metadata.title'),
            description: t('metadata.description'),
            projects,
          })}
        />
      </main>
      <SiteFooter />
    </>
  )
}
