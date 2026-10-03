import 'server-only'
import { connectDB } from './connect'
import { Project } from './models/Project'

/** Published projects in console order, the first `limit` of them. */
export async function findPublishedProjects(limit: number) {
  await connectDB()
  return Project.find({ status: 'published' }).sort({ order: 1 }).limit(limit).lean()
}

export async function countPublishedProjects() {
  await connectDB()
  return Project.countDocuments({ status: 'published' })
}
