import 'server-only'
import { isValidObjectId } from 'mongoose'
import { connectDB } from './connect'
import { Project } from './models/Project'

const published = { status: 'published' } as const

// What a project teaser needs (index frames, the next-project band); leaves the case-study fields behind.
const teaserFields = 'slug title kind summary cover startedAt endedAt order starred'

/** Published projects in console order; all of them unless `limit` is given. */
export async function findPublishedProjects(limit?: number) {
  await connectDB()
  const query = Project.find(published).sort({ order: 1 })
  return (limit ? query.limit(limit) : query).lean()
}

export async function findPublishedProjectTeasers() {
  await connectDB()
  return Project.find(published).select(teaserFields).sort({ order: 1 }).lean()
}

export async function findPublishedProjectBySlug(slug: string) {
  await connectDB()
  return Project.findOne({ ...published, slug }).lean()
}

/** The next published project after `order` in console order, if there is one. */
export async function findPublishedTeaserAfter(order: number) {
  await connectDB()
  return Project.findOne({ ...published, order: { $gt: order } }).select(teaserFields).sort({ order: 1 }).lean()
}

export async function findFirstPublishedTeaser() {
  await connectDB()
  return Project.findOne(published).select(teaserFields).sort({ order: 1 }).lean()
}

export async function findPublishedSlugs() {
  await connectDB()
  const records = await Project.find(published).select('slug').lean()
  return records.map((record) => record.slug)
}

/** Slugs of the published projects among `ids`, by id. Ids that aren't valid or published are left out. */
export async function findPublishedSlugsByIds(ids: string[]) {
  const valid = ids.filter((id) => isValidObjectId(id))
  if (valid.length === 0) return new Map<string, string>()
  await connectDB()
  const records = await Project.find({ ...published, _id: { $in: valid } }).select('slug').lean()
  return new Map(records.map((record) => [record._id.toString(), record.slug]))
}

export async function countPublishedProjects() {
  await connectDB()
  return Project.countDocuments(published)
}

/** Published and draft counts, for the console's navigation. */
export async function countProjectsByStatus() {
  await connectDB()
  const [published, draft] = await Promise.all([
    Project.countDocuments({ status: 'published' }),
    Project.countDocuments({ status: 'draft' }),
  ])
  return { published, draft }
}

// The console's reads and writes. See docs/portfolio.md#console

const consoleListFields = 'slug title kind summary status starred order cover startedAt endedAt updatedAt'

/** Every project, drafts too, in console order. */
export async function findConsoleProjects() {
  await connectDB()
  return Project.find().select(consoleListFields).sort({ order: 1, createdAt: 1 }).lean()
}

export async function findProjectById(id: string) {
  await connectDB()
  return Project.findById(id).lean()
}

/** Every project, drafts too, with what the CV setup shows when picking one. See docs/cv.md#setup */
export async function findCvProjects() {
  await connectDB()
  return Project.find().select('title status liveUrl repoUrl').sort({ order: 1, createdAt: 1 }).lean()
}

/** The id of the project using `slug`, if any. */
export async function findProjectIdBySlug(slug: string) {
  await connectDB()
  const record = await Project.findOne({ slug }).select('_id').lean()
  return record?._id.toString() ?? null
}

/** A new draft at the end of the list. */
export async function insertProject(fields: { slug: string; title: { en: string; ar: string } }) {
  await connectDB()
  const last = await Project.findOne().select('order').sort({ order: -1 }).lean()
  const record = await Project.create({ ...fields, status: 'draft', order: (last?.order ?? 0) + 1 })
  return record._id.toString()
}

/** Replaces the edited fields and returns the document as it was before, or null when it doesn't exist. */
export async function updateProject(id: string, fields: Record<string, unknown>) {
  await connectDB()
  return Project.findByIdAndUpdate(id, { $set: fields }, { runValidators: true }).lean()
}

export async function updateProjectFlags(id: string, flags: { status?: 'draft' | 'published'; starred?: boolean }) {
  await connectDB()
  return Project.findByIdAndUpdate(id, { $set: flags }, { runValidators: true }).select('slug').lean()
}

/** Sets `order` from the position of each id in `ids`. */
export async function reorderProjects(ids: string[]) {
  await connectDB()
  await Project.bulkWrite(ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: index + 1 } } } })))
}

/** Deletes a draft; a published project has to be unpublished first. Returns the deleted document. */
export async function deleteDraftProject(id: string) {
  await connectDB()
  return Project.findOneAndDelete({ _id: id, status: 'draft' }).lean()
}
