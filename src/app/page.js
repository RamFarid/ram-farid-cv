import HomeSlider from '@/components/HomeSlider/HomeSlider'
import ProjectsMarquee from '@/components/ProjectsMarquee/ProjectsMarquee'
import getCVMetaData from '@/utils/getCVMetaData'
import getProjects from '@/utils/getProjects'

export default async function Home() {
  const [projectsCount, metadata, projects] = await Promise.all([
    getProjects(true),
    getCVMetaData(),
    getProjects(false, { select: ['imgURL', 'title', 'slug'] }),
  ])
  return (
    <main>
      <HomeSlider
        projectsCount={projectsCount}
        clientsNo={metadata.clientsNo}
        cvFile={metadata.cvFile}
      />
      <ProjectsMarquee projects={projects} />
    </main>
  )
}
