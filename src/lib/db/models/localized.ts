import mongoose from 'mongoose'

const localizedText = { type: String, required: true, trim: true } as const

const localizedStringSchema = new mongoose.Schema({ en: localizedText, ar: localizedText }, { _id: false })

// User-facing text is stored once per locale. A required sub-schema (not a nested path) so both
// the document and its inferred type always carry `en` and `ar`. See docs/database.md#localized-fields
export const localizedString = () => ({ type: localizedStringSchema, required: true }) as const
