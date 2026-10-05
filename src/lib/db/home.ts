import 'server-only'
import { connectDB } from './connect'
import { HomeContent, type HomeContentRecord } from './models/HomeContent'

type HomeContentPatch = Partial<Pick<HomeContentRecord, 'about' | 'experience' | 'services' | 'skillGroups' | 'certifications'>>

/** The home page's content document, or null before the seed has run. */
export async function findHomeContent() {
  await connectDB()
  return HomeContent.findOne().lean()
}

/** Replaces the given sections of the single content document (creating it if needed) and returns it as it was before. */
export async function updateHomeContent(patch: HomeContentPatch) {
  await connectDB()
  return HomeContent.findOneAndUpdate({}, { $set: patch }, { runValidators: true, upsert: true }).lean()
}
