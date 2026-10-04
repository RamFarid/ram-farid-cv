import mongoose, { type InferSchemaType, type Model } from 'mongoose'

// Site-wide facts about Ram that the console manages: one document. Facts that never change (career start, contact
// channels) stay in lib/profile as code. See docs/console.md#cv

const fileSchema = new mongoose.Schema(
  {
    // Public R2 URL. Each upload gets a new key, so a replaced file never lingers in a cache.
    url: { type: String, required: true },
    // The uploaded file's own name, shown in the console only.
    name: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 1 },
    uploadedAt: { type: Date, required: true },
  },
  { _id: false },
)

const profileSchema = new mongoose.Schema({ cv: fileSchema }, { timestamps: true })

export type ProfileRecord = InferSchemaType<typeof profileSchema>

export const Profile: Model<ProfileRecord> =
  (mongoose.models.Profile as Model<ProfileRecord> | undefined) ?? mongoose.model('Profile', profileSchema, 'Profiles')
