import { getLocale } from 'next-intl/server'
import { About } from '@/components/Home/About'
import { Certifications } from '@/components/Home/Certifications'
import { Contact } from '@/components/Home/Contact'
import { Experience } from '@/components/Home/Experience'
import { Intro } from '@/components/Home/Intro'
import { Services } from '@/components/Home/Services'
import { Skills } from '@/components/Home/Skills'
import { Work } from '@/components/Home/Work'
import { SiteFooter } from '@/components/Reusable/site/SiteFooter'
import { SiteHeader } from '@/components/Reusable/site/SiteHeader'
import { Container } from '@/components/ui/Container'
import { getHomeContent } from '@/lib/home'
import { getHomeProjects, getPublishedProjectCount } from '@/lib/projects'

// Static, regenerated daily so the experience figure stays current; console saves revalidate it.
// See docs/home.md#rendering
export const revalidate = 86400

export default async function Home() {
  const locale = await getLocale()
  const [projects, projectCount, content] = await Promise.all([
    getHomeProjects(locale),
    getPublishedProjectCount(),
    getHomeContent(locale),
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
      </main>
      <SiteFooter />
    </>
  )
}
