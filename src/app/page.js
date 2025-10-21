import ProjectsMarquee from '@/components/ProjectsMarquee/ProjectsMarquee'
import Section from '@/components/reusables/Section'
import About from '@/components/sections/About'
import ContactMe from '@/components/sections/Contact'
import Experience from '@/components/sections/Experience'
import Landing from '@/components/sections/Landing'
import Services from '@/components/sections/Services'
import Testmonials from '@/components/sections/Testimonials'
import getCVMetaData from '@/utils/getCVMetaData'
import getProjects from '@/utils/getProjects'
import '@/styles/home.css'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'
import 'swiper/css/effect-flip'
import getSocialLinks from '@/utils/getSocialLinks'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [projectsCount, metadata, projects, socialLinks] = await Promise.all([
    getProjects(true),
    getCVMetaData(),
    getProjects(false, { select: ['imgURL', 'title', 'slug'] }),
    getSocialLinks(),
  ])
  return (
    <main>
      <div className='scroll-container home_slider'>
        {/* <HomeSlider
        projectsCount={projectsCount}
        clientsNo={metadata.clientsNo}
        cvFile={metadata.cvFile}
      /> */}
        {[
          {
            element: (
              <Landing cvFile={metadata.cvFile} socialLinks={socialLinks} />
            ),
            sectionProps: { className: 'home-sec' },
            id: 'landing',
            hasFS: false,
          },
          {
            element: (
              <About
                clientsNo={metadata.clientsNo}
                projectsCount={projectsCount}
              />
            ),
            sectionProps: {
              sub: 'get to know',
              head: 'about me',
              className: 'about',
            },
            id: 'about-me',
            hasFS: true,
          },
          {
            element: <Experience />,
            sectionProps: {
              head: 'My Experience',
              sub: 'What skills i have?',
              className: 'experience',
            },
            id: 'experience',
            hasFS: true,
          },
          {
            element: <Services />,
            sectionProps: { head: 'Services', sub: 'what i offer?' },
            id: 'services',
            hasFS: false,
          },
          {
            element: <Testmonials />,
            sectionProps: {
              head: 'Testmonials',
              sub: 'Temporary Certs. until I graduate',
            },
            id: 'testimonials',
            hasFS: false,
          },
          {
            element: <ContactMe socialLinks={socialLinks} />,
            sectionProps: {
              className: 'contact',
              sub: 'get in touch',
              head: 'contact me',
            },
            id: 'contact-me',
            hasFS: true,
          },
        ].map((item) => (
          <Section
            key={item.id}
            {...item.sectionProps}
            className={'scroll-item ' + item.sectionProps.className}
          >
            {item.element}
          </Section>
        ))}
      </div>
      <ProjectsMarquee projects={projects} />
    </main>
  )
}
