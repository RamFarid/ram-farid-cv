import mongoose, { type InferSchemaType, type Model } from 'mongoose'

// A trusted console device. The cookie holds a random token; only its SHA-256 is stored, so a database leak can't be
// replayed as a cookie. Deleting the document signs that device out. See docs/console.md#sign-in
const sessionSchema = new mongoose.Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userAgent: { type: String, trim: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
)

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type SessionRecord = InferSchemaType<typeof sessionSchema>

export const Session: Model<SessionRecord> =
  (mongoose.models.Session as Model<SessionRecord> | undefined) ?? mongoose.model('Session', sessionSchema, 'Sessions')
