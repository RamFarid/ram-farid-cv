import 'server-only'
import { connectDB } from './connect'
import { Project } from './models/Project'

const published = { status: 'published' } as const

// What a project teaser needs (index frames, the next-project band); leaves the case-study fields behind.
const teaserFields = 'slug title kind summary cover startedAt endedAt order'

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
