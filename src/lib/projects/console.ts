import 'server-only'
import { cache } from 'react'
import { isValidObjectId } from 'mongoose'
import {
  deleteDraftProject,
  findConsoleProjects,
  findProjectById,
  findProjectIdBySlug,
  insertProject,
  reorderProjects,
  updateProject,
  updateProjectFlags,
} from '@/lib/db/projects'
import type { ProjectRecord } from '@/lib/db/models/Project'
import { deleteObjects, isBucketUrl } from '@/lib/storage'
import type { FieldErrors } from '@/lib/validations/errors'
import {
  projectPublishZSchema,
  slugify,
  type ProjectInput,
  type ProjectStatus,
} from '@/lib/validations/project'
import { storyHtml } from './markdown'
import { findStackTool, type StackId } from './stack'
import type { ConsoleProject, ConsoleProjectRow } from './types'

// The console's side of projects: the list, one project's editable draft, and every write. See docs/portfolio.md#console

type LocalizedRecord = { en?: string | null; ar?: string | null } | null | undefined

const pair = (value: LocalizedRecord) => ({ en: value?.en ?? '', ar: value?.ar ?? '' })
const day = (date: Date | null | undefined) => (date ? date.toISOString().slice(0, 10) : '')
const fromDay = (value: string) => (value ? new Date(`${value}T00:00:00Z`) : null)

function projectYear(record: Pick<ProjectRecord, 'startedAt' | 'endedAt'>) {
  return (record.endedAt ?? record.startedAt)?.getUTCFullYear()
}

export async function getConsoleProjects(): Promise<ConsoleProjectRow[]> {
  const records = await findConsoleProjects()
  return records.map((record) => ({
    id: record._id.toString(),
    slug: record.slug,
    title: pair(record.title),
    kind: pair(record.kind),
    status: record.status,
    starred: record.starred ?? false,
    year: projectYear(record),
    cover: record.cover ? { url: record.cover.url, width: record.cover.width, height: record.cover.height } : undefined,
  }))
}

/** A stored project as the edit page's draft. Blank values stand in for what a draft hasn't filled yet. */
export function toProjectInput(record: ProjectRecord): ProjectInput {
  const deliverables = record.deliverables ?? { en: [], ar: [] }
  const rows = Math.max(deliverables.en?.length ?? 0, deliverables.ar?.length ?? 0)

  return {
    slug: record.slug,
    title: pair(record.title),
    kind: pair(record.kind),
    client: pair(record.client),
    summary: pair(record.summary),
    liveUrl: record.liveUrl ?? '',
    repoUrl: record.repoUrl ?? '',
    starred: record.starred ?? false,
    startedAt: day(record.startedAt),
    endedAt: day(record.endedAt),
    // Ids removed from lib/projects/stack.ts (or tech names stored before it existed) drop out here.
    stack: (record.stack ?? []).filter((id): id is StackId => findStackTool(id) !== undefined),
    cover: record.cover
      ? { url: record.cover.url, width: record.cover.width, height: record.cover.height, alt: pair(record.cover.alt) }
      : null,
    screenshots: (record.screenshots ?? []).map((shot) => ({
      url: shot.url,
      width: shot.width,
      height: shot.height,
      device: shot.device,
      alt: pair(shot.alt),
      caption: pair(shot.caption),
    })),
    role: pair(record.role),
    overview: pair(record.overview),
    deliverables: Array.from({ length: rows }, (_, index) => ({
      id: `deliverable-${index}`,
      text: { en: deliverables.en?.[index] ?? '', ar: deliverables.ar?.[index] ?? '' },
    })),
    story: pair(record.storyMarkdown),
  }
}

/** One project for its edit page, or null when the id is malformed or unknown. Deduped per request. */
export const getConsoleProject = cache(async (id: string): Promise<ConsoleProject | null> => {
  if (!isValidObjectId(id)) return null
  const record = await findProjectById(id)
  if (!record) return null
  return { id, status: record.status, input: toProjectInput(record) }
})

/** Every bucket image a project uses: cover, screenshots and the images in its stories. */
function imagesOf(project: Pick<ProjectInput, 'cover' | 'screenshots' | 'story'>) {
  const inStory = [project.story.en, project.story.ar].flatMap((markdown) =>
    [...markdown.matchAll(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/g)].map((match) => match[1]),
  )
  return new Set([project.cover?.url, ...project.screenshots.map((shot) => shot.url), ...inStory].filter(Boolean) as string[])
}

/** Field errors the schema can't see: a slug another project uses, images from outside our bucket. */
async function checkProject(id: string, input: ProjectInput): Promise<FieldErrors> {
  const errors: FieldErrors = {}
  const owner = await findProjectIdBySlug(input.slug)
  if (owner && owner !== id) errors.slug = 'taken'
  if (input.cover && !isBucketUrl(input.cover.url)) errors.cover = 'invalid'
  input.screenshots.forEach((shot, index) => {
    if (!isBucketUrl(shot.url)) errors[`screenshots.${index}`] = 'invalid'
  })
  return errors
}

export type SaveProjectOutcome =
  | { ok: true; slugs: string[]; unusedImages: string[] }
  | { ok: false; error: 'notFound' }
  | { ok: false; error: 'invalid'; fieldErrors: FieldErrors }

/**
 * Saves a validated draft, turning each story's Markdown into sanitized HTML. `status` publishes or unpublishes in the
 * same write. Returns the slugs whose pages changed and the images the project no longer uses.
 */
export async function saveProject(id: string, input: ProjectInput, status?: ProjectStatus): Promise<SaveProjectOutcome> {
  const fieldErrors = await checkProject(id, input)
  if (Object.keys(fieldErrors).length) return { ok: false, error: 'invalid', fieldErrors }

  const [storyEn, storyAr] = await Promise.all([storyHtml(input.story.en, 'en'), storyHtml(input.story.ar, 'ar')])
  const deliverables = input.deliverables.filter((row) => row.text.en || row.text.ar)

  const previous = await updateProject(id, {
    slug: input.slug,
    title: input.title,
    kind: input.kind,
    client: input.client,
    summary: input.summary,
    liveUrl: input.liveUrl,
    repoUrl: input.repoUrl,
    starred: input.starred,
    startedAt: fromDay(input.startedAt),
    endedAt: fromDay(input.endedAt),
    stack: input.stack,
    cover: input.cover,
    screenshots: input.screenshots,
    role: input.role,
    overview: input.overview,
    deliverables: { en: deliverables.map((row) => row.text.en), ar: deliverables.map((row) => row.text.ar) },
    storyMarkdown: input.story,
    story: { en: storyEn, ar: storyAr },
    ...(status ? { status } : {}),
  })
  if (!previous) return { ok: false, error: 'notFound' }

  const kept = imagesOf(input)
  const unusedImages = [...imagesOf(toProjectInput(previous))].filter((url) => !kept.has(url))
  return { ok: true, slugs: [previous.slug, input.slug], unusedImages }
}

export type FlagOutcome =
  | { ok: true; slug: string }
  | { ok: false; error: 'notFound' }
  | { ok: false; error: 'incomplete'; missing: string[] }

/** Publishes or unpublishes without touching the content. Publishing checks the stored project is complete. */
export async function setProjectStatus(id: string, status: ProjectStatus): Promise<FlagOutcome> {
  if (!isValidObjectId(id)) return { ok: false, error: 'notFound' }
  if (status === 'published') {
    const record = await findProjectById(id)
    if (!record) return { ok: false, error: 'notFound' }
    const parsed = projectPublishZSchema.safeParse(toProjectInput(record))
    if (!parsed.success) return { ok: false, error: 'incomplete', missing: parsed.error.issues.map((issue) => issue.path.join('.')) }
  }
  const record = await updateProjectFlags(id, { status })
  return record ? { ok: true, slug: record.slug } : { ok: false, error: 'notFound' }
}

export async function setProjectStarred(id: string, starred: boolean): Promise<FlagOutcome> {
  if (!isValidObjectId(id)) return { ok: false, error: 'notFound' }
  const record = await updateProjectFlags(id, { starred })
  return record ? { ok: true, slug: record.slug } : { ok: false, error: 'notFound' }
}

export async function setProjectOrder(ids: string[]) {
  if (!ids.every((id) => isValidObjectId(id))) return false
  await reorderProjects(ids)
  return true
}

/** A new draft named by its English title, with a slug made from it (numbered when taken). Returns its id. */
export async function createProject(title: string) {
  const base = slugify(title) || 'project'
  let slug = base
  for (let n = 2; await findProjectIdBySlug(slug); n++) slug = `${base}-${n}`
  return insertProject({ slug, title: { en: title, ar: '' } })
}

/** Deletes a draft and its images. False when it doesn't exist or is published. */
export async function deleteProject(id: string) {
  if (!isValidObjectId(id)) return false
  const record = await deleteDraftProject(id)
  if (!record) return false
  await deleteObjects([...imagesOf(toProjectInput(record))]).catch((error: unknown) =>
    console.error('Deleting a project’s R2 images failed:', error),
  )
  return true
}
