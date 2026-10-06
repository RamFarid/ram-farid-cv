import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { About } from '@/components/Home/About'
import { Certifications } from '@/components/Home/Certifications'
import { Contact } from '@/components/Home/Contact'
import { Experience } from '@/components/Home/Experience'
import { Intro } from '@/components/Home/Intro'
import { Services } from '@/components/Home/Services'
import { Skills } from '@/components/Home/Skills'
import { Work } from '@/components/Home/Work'
import { JsonLd } from '@/components/Reusable/seo/JsonLd'
import { SiteFooter } from '@/components/Reusable/site/SiteFooter'
import { SiteHeader } from '@/components/Reusable/site/SiteHeader'
import { Container } from '@/components/ui/Container'
import { getHomeContent, getHomeContentUpdatedAt } from '@/lib/home'
import { getHomeProjects, getPublishedProjectCount } from '@/lib/projects'
import { pageMetadata } from '@/lib/seo/metadata'
import { profilePageJsonLd } from '@/lib/seo/structured-data'

// Static, regenerated daily so the experience figure stays current; console saves revalidate it.
// See docs/home.md#rendering
export const revalidate = 86400

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('Metadata')

  return pageMetadata({ locale, href: '/', title: t('title'), description: t('description') })
}

export default async function Home() {
  const locale = await getLocale()
  const [projects, projectCount, content, updatedAt, t, tAr, tEn] = await Promise.all([
    getHomeProjects(locale),
    getPublishedProjectCount(),
    getHomeContent(locale),
    getHomeContentUpdatedAt(),
    getTranslations('Metadata'),
    getTranslations({ locale: 'ar', namespace: 'Metadata' }),
    getTranslations({ locale: 'en', namespace: 'Metadata' }),
  ])

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Intro />
        <Work projects={projects} />
        {content.about && <About about={content.about} projectCount={projectCount} />}
        <Experience experience={content.experience} />
        {(content.services.length > 0 || content.skillGroups.length > 0) && (
          <div className="border-y border-line bg-surface py-space-8 md:py-space-9">
            <Container className="grid gap-space-9">
              <Services services={content.services} />
              <Skills skillGroups={content.skillGroups} />
            </Container>
          </div>
        )}
        <Certifications certifications={content.certifications} />
        <Contact />

        <JsonLd
          data={profilePageJsonLd({
            locale,
            names: { en: tEn('name'), ar: tAr('name') },
            title: t('title'),
            description: t('description'),
            jobTitle: t('jobTitle'),
            home: content,
            updatedAt,
          })}
        />
      </main>
      <SiteFooter />
    </>
  )
}
