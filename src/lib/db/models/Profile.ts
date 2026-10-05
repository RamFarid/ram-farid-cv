import mongoose, { type InferSchemaType, type Model } from 'mongoose'
import { cvContactIds, cvExperienceTiers, cvPageSizes, cvSectionIds } from '@/lib/validations/cv'

// Site-wide settings about Ram that the console manages: one document. Facts that never change (career start, contact
// channels, education) stay in lib/profile as code. See docs/database.md#profiles

const cvSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true, trim: true },
    tools: { type: [String], default: [] },
    summary: { type: String, default: '', trim: true },
    contacts: { type: [{ type: String, enum: cvContactIds }], default: [] },
    sections: {
      type: [
        new mongoose.Schema(
          { id: { type: String, enum: cvSectionIds, required: true }, visible: { type: Boolean, required: true } },
          { _id: false },
        ),
      ],
      default: [],
    },
    // Ids of the home page's experience entries, project ids, skill group ids and certificate ids: references into
    // other documents, dropped on read once their target is gone. See docs/cv.md#setup
    experience: {
      type: [
        new mongoose.Schema(
          {
            id: { type: String, required: true },
            tier: { type: String, enum: cvExperienceTiers, required: true },
            hiddenHighlights: { type: [String], default: [] },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    projects: {
      type: [
        new mongoose.Schema(
          {
            projectId: { type: String, required: true },
            title: { type: String, default: '', trim: true },
            links: { type: [String], default: [] },
            bullets: {
              type: [new mongoose.Schema({ id: { type: String, required: true }, text: { type: String, required: true } }, { _id: false })],
              default: [],
            },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    skills: {
      type: [
        new mongoose.Schema(
          {
            groupId: { type: String, required: true },
            label: { type: String, default: '', trim: true },
            hiddenItems: { type: [String], default: [] },
            hiddenPractices: { type: [String], default: [] },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    certifications: { type: [String], default: [] },
    pageSize: { type: String, enum: cvPageSizes, default: 'A4' },
  },
  { _id: false },
)

const profileSchema = new mongoose.Schema({ cv: cvSchema }, { timestamps: true })

export type ProfileRecord = InferSchemaType<typeof profileSchema>

export const Profile: Model<ProfileRecord> =
  (mongoose.models.Profile as Model<ProfileRecord> | undefined) ?? mongoose.model('Profile', profileSchema, 'Profiles')
