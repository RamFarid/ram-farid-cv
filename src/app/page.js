import HomeSlider from '@/components/HomeSlider/HomeSlider'
import ProjectsMarquee from '@/components/ProjectsMarquee/ProjectsMarquee'
import getClientsNo from '@/utils/getClientsNo'
import getProjects from '@/utils/getProjects'

export default async function Home() {
  const [projectsCount, clientsDoc, projects] = await Promise.all([
    getProjects(true),
    getClientsNo(),
    getProjects(false, { select: ['imgURL', 'title', 'slug'] }),
  ])
  return (
    <main>
      <HomeSlider projectsCount={projectsCount} clientsDoc={clientsDoc} />
      <ProjectsMarquee projects={projects} />
    </main>
  )
}
