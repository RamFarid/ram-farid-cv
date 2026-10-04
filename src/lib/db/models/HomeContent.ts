import mongoose, { type InferSchemaType, type Model } from 'mongoose'
import { localizedString } from './localized'

// The home page's editable content: one document, edited section by section from the console.
// Lengths and counts are enforced by the Zod schemas in lib/validations/home.ts. See docs/console.md#home-content

const imageSchema = new mongoose.Schema(
  {
    // Public R2 URL, like project images. See docs/portfolio.md#images
    url: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false },
)

// List items carry their own string `id` (made in the console) so React keys and field errors stay stable across saves.
const itemId = { type: String, required: true } as const

const aboutSchema = new mongoose.Schema(
  {
    title: localizedString(),
    // Plain text; blank lines split paragraphs and `{clients}` becomes the client count.
    body: localizedString(),
    clientCount: { type: Number, required: true, min: 0 },
    portrait: imageSchema,
  },
  { _id: false },
)

const serviceSchema = new mongoose.Schema({ id: itemId, title: localizedString(), body: localizedString() }, { _id: false })

const skillGroupSchema = new mongoose.Schema(
  {
    id: itemId,
    name: localizedString(),
    // Tech names, the same in both languages.
    items: { type: [String], default: [] },
    // Practices (database design, authorization), translated.
    practices: { type: [new mongoose.Schema({ id: itemId, label: localizedString() }, { _id: false })], default: [] },
  },
  { _id: false },
)

const certificationSchema = new mongoose.Schema(
  {
    id: itemId,
    // As issued, never translated.
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    /** `YYYY-MM`. */
    issuedOn: String,
    description: localizedString(),
    skills: { type: [String], default: [] },
    image: imageSchema,
  },
  { _id: false },
)

const homeContentSchema = new mongoose.Schema(
  {
    about: { type: aboutSchema, required: true },
    services: { type: [serviceSchema], default: [] },
    skillGroups: { type: [skillGroupSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
  },
  { timestamps: true },
)

export type HomeContentRecord = InferSchemaType<typeof homeContentSchema>

export const HomeContent: Model<HomeContentRecord> =
  (mongoose.models.HomeContent as Model<HomeContentRecord> | undefined) ??
  mongoose.model('HomeContent', homeContentSchema, 'HomeContents')
