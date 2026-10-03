import { getLocale } from 'next-intl/server'
import { About } from '@/components/Home/About'
import { Certifications } from '@/components/Home/Certifications'
import { Intro } from '@/components/Home/Intro'
import { Services } from '@/components/Home/Services'
import { Skills } from '@/components/Home/Skills'
import { Work } from '@/components/Home/Work'
import { SiteFooter } from '@/components/Reusable/site/SiteFooter'
import { SiteHeader } from '@/components/Reusable/site/SiteHeader'
import { Container } from '@/components/ui/Container'
import { getHomeProjects, getPublishedProjectCount } from '@/lib/projects'

// Static, regenerated daily so the experience figure stays current; the console will revalidate on project changes.
// See docs/home.md#rendering
export const revalidate = 86400

export default async function Home() {
  const locale = await getLocale()
  const [projects, projectCount] = await Promise.all([getHomeProjects(locale), getPublishedProjectCount()])

  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Intro />
        <Work projects={projects} />
        <About projectCount={projectCount} />
        <div className="border-y border-line bg-surface py-space-8 md:py-space-9">
          <Container className="grid gap-space-9">
            <Services />
            <Skills />
          </Container>
        </div>
        <Certifications />
      </main>
      <SiteFooter />
    </>
  )
}
