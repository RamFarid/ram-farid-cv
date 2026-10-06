import 'server-only'
import type { CvConfigInput } from '@/lib/validations/cv'
import type { AvailabilityInput } from '@/lib/validations/profile'
import { connectDB } from './connect'
import { Profile } from './models/Profile'

/** The profile document, or null before anything has been saved. */
export async function findProfile() {
  await connectDB()
  return Profile.findOne().lean()
}

/** Replaces the CV setup, creating the document if needed. */
export async function setProfileCv(cv: CvConfigInput) {
  await connectDB()
  await Profile.updateOne({}, { $set: { cv } }, { runValidators: true, upsert: true })
}

/** Replaces the availability, creating the document if needed. */
export async function setProfileAvailability(availability: AvailabilityInput) {
  await connectDB()
  await Profile.updateOne({}, { $set: { availability } }, { runValidators: true, upsert: true })
}
