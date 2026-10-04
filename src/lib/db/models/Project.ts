import mongoose, { type InferSchemaType, type Model } from 'mongoose'
import { projectLimits, screenshotDevices } from '@/lib/validations/project'

export const projectStatuses = ['draft', 'published'] as const

const draftText = { type: String, trim: true, default: '' } as const

// Text per locale that a draft may leave blank. The console's publish check (lib/validations/project.ts) requires both
// locales before a project goes live, so published documents are always complete. See docs/portfolio.md#console
const draftLocalizedString = () =>
  ({
    type: new mongoose.Schema({ en: draftText, ar: draftText }, { _id: false }),
    required: true,
    default: () => ({}),
  }) as const

const imageFields = {
  // Public R2 URL. See docs/portfolio.md#images
  url: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  alt: draftLocalizedString(),
}

const coverSchema = new mongoose.Schema(imageFields, { _id: false })

const screenshotSchema = new mongoose.Schema(
  {
    ...imageFields,
    device: { type: String, enum: screenshotDevices, required: true },
    caption: draftLocalizedString(),
  },
  { _id: false },
)

const projectSchema = new mongoose.Schema(
  {
    // Becomes the /portfolio/[project_id] segment.
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: draftLocalizedString(),
    client: draftLocalizedString(),
    kind: draftLocalizedString(),
    // One sentence: what it is and who it's for (docs/design-system/components/ProjectCard).
    summary: draftLocalizedString(),
    // Ids from lib/projects/stack.ts, in display order.
    stack: { type: [String], default: [] },
    // Marked "Recommended" on the public pages; it doesn't change the order. See docs/portfolio.md#starred
    starred: { type: Boolean, default: false },
    liveUrl: String,
    // Only for public repos; most client repos are private.
    repoUrl: String,
    cover: coverSchema,
    // The year shown on the index and home bands comes from these. An unset `endedAt` means the work is ongoing.
    startedAt: Date,
    endedAt: Date,
    role: draftLocalizedString(),
    overview: draftLocalizedString(),
    deliverables: {
      type: new mongoose.Schema({ en: [String], ar: [String] }, { _id: false }),
    },
    // The Markdown Ram writes in the console, kept so it can be edited again.
    storyMarkdown: draftLocalizedString(),
    // Sanitized HTML made from `storyMarkdown` on save, rendered as-is on the case study. See docs/portfolio.md#story-html
    story: draftLocalizedString(),
    screenshots: {
      type: [screenshotSchema],
      default: [],
      validate: {
        validator: (shots: unknown[]) => shots.length <= projectLimits.screenshots,
        message: `A project has at most ${projectLimits.screenshots} screenshots`,
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
