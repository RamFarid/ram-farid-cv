import type { Locale } from 'next-intl'
import { countPublishedProjects, findPublishedProjects } from '@/lib/db/projects'
import type { PublicProject } from './types'

// The home page shows the first two published projects in console order; the rest live in /portfolio. See docs/home.md#structure-work-first-in-project-bands
const HOME_PROJECT_COUNT = 2

/** The home page's project bands: the first published projects by `order`, no hand-picked flag. */
export async function getHomeProjects(locale: Locale): Promise<PublicProject[]> {
  const records = await findPublishedProjects(HOME_PROJECT_COUNT)

  return records.map((record) => ({
    slug: record.slug,
    title: record.title[locale],
    client: record.client[locale],
    kind: record.kind[locale],
    summary: record.summary[locale],
    year: record.year ?? undefined,
    stack: record.stack,
    liveUrl: record.liveUrl ?? undefined,
    cover: record.cover ? { ...record.cover, alt: record.cover.alt[locale] } : undefined,
  }))
}

/** The site's "projects" figure. Never typed by hand. See docs/database.md#projects-model-project */
export function getPublishedProjectCount() {
  return countPublishedProjects()
}
