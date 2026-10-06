import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getHomeContentUpdatedAt } from '@/lib/home'
import { getPublishedProjectDates } from '@/lib/projects'
import { absoluteUrl, languageAlternates } from '@/lib/seo/metadata'

// Static like the pages it lists, regenerated daily; console saves of projects and home content revalidate it.
// See docs/seo.md#site-wide-files
export const revalidate = 86400

const latest = (dates: (Date | null | undefined)[]) =>
  dates.reduce<Date | undefined>((max, date) => (date && (!max || date > max) ? date : max), undefined)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [homeUpdatedAt, projects] = await Promise.all([getHomeContentUpdatedAt(), getPublishedProjectDates()])
  const projectsUpdatedAt = latest(projects.map((project) => project.updatedAt))

  // `lastModified` is the last content write a page shows: the home page shows projects too.
  const pages = [
    { href: '/', lastModified: latest([homeUpdatedAt, projectsUpdatedAt]) },
    { href: '/portfolio', lastModified: projectsUpdatedAt },
    ...projects.map((project) => ({ href: `/portfolio/${project.slug}`, lastModified: project.updatedAt })),
  ]

  // One entry per page per locale, each listing every language version.
  return pages.flatMap(({ href, lastModified }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      lastModified,
      alternates: { languages: languageAlternates(href) },
    })),
  )
}
