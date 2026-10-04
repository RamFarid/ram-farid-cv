import 'server-only'
import { connectDB } from './connect'
import { Profile, type ProfileRecord } from './models/Profile'

/** The profile document, or null before anything has been saved. */
export async function findProfile() {
  await connectDB()
  return Profile.findOne().lean()
}

/** Sets the CV (creating the document if needed) and returns the document as it was before. */
export async function setProfileCv(cv: ProfileRecord['cv']) {
  await connectDB()
  const update = cv ? { $set: { cv } } : { $unset: { cv: 1 } }
  return Profile.findOneAndUpdate({}, update, { runValidators: true, upsert: true }).lean()
}
