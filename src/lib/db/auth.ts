import 'server-only'
import { connectDB } from './connect'
import { Otp } from './models/Otp'
import { Session } from './models/Session'

/** Replaces any outstanding code with a new one: only the latest code ever works. */
export async function replaceOtp(codeHash: string, expiresAt: Date) {
  await connectDB()
  await Otp.deleteMany({})
  await Otp.create({ codeHash, expiresAt })
}

export async function findLatestOtp() {
  await connectDB()
  return Otp.findOne().sort({ createdAt: -1 }).lean()
}

export async function findActiveOtp() {
  await connectDB()
  return Otp.findOne({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).lean()
}

/** Counts a wrong guess and returns the attempts made so far. */
export async function incrementOtpAttempts(id: string) {
  await connectDB()
  const otp = await Otp.findByIdAndUpdate(id, { $inc: { attempts: 1 } }, { new: true }).lean()
  return otp?.attempts ?? Infinity
}

/** Deletes the code if it's still there; true only for the caller that actually deleted it, so a code works once. */
export async function consumeOtp(id: string) {
  await connectDB()
  const { deletedCount } = await Otp.deleteOne({ _id: id })
  return deletedCount === 1
}

export async function insertSession(tokenHash: string, expiresAt: Date, userAgent?: string) {
  await connectDB()
  await Session.create({ tokenHash, expiresAt, userAgent })
}

export async function findActiveSession(tokenHash: string) {
  await connectDB()
  return Session.findOne({ tokenHash, expiresAt: { $gt: new Date() } }).select('_id expiresAt').lean()
}

export async function deleteSession(tokenHash: string) {
  await connectDB()
  await Session.deleteOne({ tokenHash })
}
