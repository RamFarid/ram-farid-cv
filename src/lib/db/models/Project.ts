import mongoose, { type InferSchemaType, type Model } from 'mongoose'
import { localizedString } from './localized'

export const projectStatuses = ['draft', 'published'] as const
export const screenshotDevices = ['desktop', 'mobile'] as const

// Desktop and phone shots together. See docs/portfolio.md#case-study-content
export const MAX_PROJECT_SCREENSHOTS = 15

const optionalLocalizedText = { type: String, trim: true } as const

// Case-study text that a draft may not have yet; the console's Zod schema will require it before publishing.
const optionalLocalizedString = () =>
  ({
    type: new mongoose.Schema({ en: optionalLocalizedText, ar: optionalLocalizedText }, { _id: false }),
  }) as const

const imageFields = {
  // Public R2 URL. See docs/portfolio.md#images
  url: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  alt: localizedString(),
}

const coverSchema = new mongoose.Schema(imageFields, { _id: false })

const screenshotSchema = new mongoose.Schema(
  {
    ...imageFields,
    device: { type: String, enum: screenshotDevices, required: true },
    caption: optionalLocalizedString(),
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    // Becomes the /portfolio/[project_id] segment.
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: localizedString(),
    client: localizedString(),
    kind: localizedString(),
    // One sentence: what it is and who it's for (docs/design-system/components/ProjectCard).
    summary: localizedString(),
    stack: { type: [String], default: [] },
    liveUrl: String,
    // Only for public repos; most client repos are private.
    repoUrl: String,
    cover: coverSchema,
    // The year shown on the index and home bands comes from these. An unset `endedAt` means the work is ongoing.
    startedAt: Date,
    endedAt: Date,
    role: optionalLocalizedString(),
    overview: optionalLocalizedString(),
    deliverables: {
      type: new mongoose.Schema({ en: [String], ar: [String] }, { _id: false }),
    },
    // Sanitized HTML, rendered as-is on the case study. See docs/portfolio.md#story-html
    story: optionalLocalizedString(),
    screenshots: {
      type: [screenshotSchema],
      default: [],
      validate: {
        validator: (shots: unknown[]) => shots.length <= MAX_PROJECT_SCREENSHOTS,
        message: `A project has at most ${MAX_PROJECT_SCREENSHOTS} screenshots`,
      },
    },
    status: { type: String, enum: projectStatuses, default: 'draft' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

projectSchema.index({ status: 1, order: 1 })

export type ProjectRecord = InferSchemaType<typeof projectSchema>

export const Project: Model<ProjectRecord> =
  (mongoose.models.Project as Model<ProjectRecord> | undefined) ??
  mongoose.model('Project', projectSchema, 'Projects')
