import mongoose, { type InferSchemaType, type Model } from 'mongoose'
import { localizedString } from './localized'

export const projectStatuses = ['draft', 'published'] as const

const coverSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    alt: localizedString(),
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
    year: Number,
    stack: { type: [String], default: [] },
    liveUrl: String,
    cover: coverSchema,
    status: { type: String, enum: projectStatuses, default: 'draft' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

projectSchema.index({ status: 1, featured: 1, order: 1 })

export type ProjectRecord = InferSchemaType<typeof projectSchema>

export const Project =
  (mongoose.models.Project as Model<ProjectRecord> | undefined) ??
  mongoose.model('Project', projectSchema, 'Projects')
