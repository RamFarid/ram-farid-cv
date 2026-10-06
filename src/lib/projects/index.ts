import { differenceInCalendarDays } from 'date-fns'
import type { Locale } from 'next-intl'
import {
  countPublishedProjects,
  findFirstPublishedTeaser,
  findPublishedProjectBySlug,
  findPublishedProjectDates,
  findPublishedProjects,
  findPublishedProjectTeasers,
  findPublishedSlugs,
  findPublishedTeaserAfter,
} from '@/lib/db/projects'
import type { ProjectRecord } from '@/lib/db/models/Project'
import type { ProjectCaseStudy, ProjectImage, ProjectTeaser, PublicProject } from './types'

// The home page shows the first two published projects in console order; the rest live in /portfolio. See docs/home.md#structure-work-first-in-project-bands
const HOME_PROJECT_COUNT = 2

type TeaserRecord = Pick<ProjectRecord, 'slug' | 'title' | 'kind' | 'summary' | 'cover' | 'startedAt' | 'endedAt' | 'starred'>
type LocalizedImage = Omit<ProjectImage, 'alt'> & { alt: Record<Locale, string> }

function toImage(image: LocalizedImage, locale: Locale): ProjectImage {
  return { url: image.url, width: image.width, height: image.height, alt: image.alt[locale] }
}

/** The year a project is filed under: when it ended, or when it started if it's still running. */
function projectYear(record: Pick<ProjectRecord, 'startedAt' | 'endedAt'>) {
  return (record.endedAt ?? record.startedAt)?.getUTCFullYear()
}

function toTeaser(record: TeaserRecord, locale: Locale): ProjectTeaser {
  return {
    slug: record.slug,
    title: record.title[locale],
    kind: record.kind[locale],
    summary: record.summary[locale],
    year: projectYear(record),
    cover: record.cover ? toImage(record.cover, locale) : undefined,
    starred: record.starred ?? false,
  }
}

function toPublicProject(record: ProjectRecord, locale: Locale): PublicProject {
  return {
    ...toTeaser(record, locale),
    client: record.client[locale],
    stack: record.stack ?? [],
    liveUrl: record.liveUrl || undefined,
  }
}

/** The home page's project bands: the first published projects by `order`, no hand-picked flag. */
export async function getHomeProjects(locale: Locale): Promise<PublicProject[]> {
  const records = await findPublishedProjects(HOME_PROJECT_COUNT)
  return records.map((record) => toPublicProject(record, locale))
}

/** Every published project for /portfolio, in console order. Teasers only: the rest belongs to the case study. */
export async function getPortfolioProjects(locale: Locale): Promise<ProjectTeaser[]> {
  const records = await findPublishedProjectTeasers()
  return records.map((record) => toTeaser(record, locale))
}

/** Every published project's slug and last write, for the sitemap. */
export async function getPublishedProjectDates(): Promise<{ slug: string; updatedAt: Date }[]> {
  const records = await findPublishedProjectDates()
  return records.map((record) => ({ slug: record.slug, updatedAt: record.updatedAt }))
}

export function getPublishedProjectSlugs() {
  return findPublishedSlugs()
}

/**
 * A published project's case study and the project after it (wrapping to the first), or null when the slug isn't
 * published. `next` is null when this is the only project.
 */
export async function getCaseStudy(
  slug: string,
  locale: Locale,
): Promise<{ project: ProjectCaseStudy; next: ProjectTeaser | null } | null> {
  const record = await findPublishedProjectBySlug(slug)
  if (!record) return null

  const nextRecord = (await findPublishedTeaserAfter(record.order)) ?? (await findFirstPublishedTeaser())

  const project: ProjectCaseStudy = {
    ...toPublicProject(record, locale),
    repoUrl: record.repoUrl || undefined,
    startedAt: record.startedAt?.toISOString(),
    endedAt: record.endedAt?.toISOString(),
    role: record.role?.[locale] || undefined,
    overview: record.overview?.[locale] || undefined,
    deliverables: record.deliverables?.[locale] ?? [],
    storyHtml: record.story?.[locale] || undefined,
    // Lean reads skip schema defaults, so a project saved before screenshots existed has no array at all.
    screenshots: (record.screenshots ?? []).map((shot) => ({
      ...toImage(shot, locale),
      device: shot.device,
      caption: shot.caption?.[locale] || undefined,
    })),
  }

  return {
    project,
    next: nextRecord && nextRecord.slug !== record.slug ? toTeaser(nextRecord, locale) : null,
  }
}

/** How long a finished project ran: days under about six weeks, whole months after that. Both dates count. */
export function getProjectDuration(startedAt: string, endedAt: string): { unit: 'days' | 'months'; count: number } {
  const days = differenceInCalendarDays(new Date(endedAt), new Date(startedAt)) + 1
  if (days < 45) return { unit: 'days', count: Math.max(days, 1) }
  return { unit: 'months', count: Math.round(days / 30.4375) }
}

/** The site's "projects" figure. Never typed by hand. See docs/database.md#projects-model-project */
export function getPublishedProjectCount() {
  return countPublishedProjects()
}
