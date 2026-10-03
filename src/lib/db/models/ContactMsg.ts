import mongoose, { type InferSchemaType, type Model } from 'mongoose'
import { routing } from '@/i18n/routing'

export const contactMsgStatuses = ['new', 'read', 'archived'] as const

// Length and format limits live in the contact Zod schema; the model stores what passed it.
const contactMsgSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    locale: { type: String, enum: [...routing.locales], required: true },
    status: { type: String, enum: contactMsgStatuses, default: 'new' },
  },
  { timestamps: true },
)

contactMsgSchema.index({ status: 1, createdAt: -1 })

export type ContactMsgRecord = InferSchemaType<typeof contactMsgSchema>

export const ContactMsg =
  (mongoose.models.ContactMsg as Model<ContactMsgRecord> | undefined) ??
  mongoose.model('ContactMsg', contactMsgSchema, 'ContactMsgs')
