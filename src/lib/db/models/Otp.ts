import mongoose, { type InferSchemaType, type Model } from 'mongoose'

// One-time sign-in codes for the console, sent by the Telegram bot. Only the SHA-256 of the code is stored; a code is
// deleted when used, when its attempts run out, or by the TTL index once it expires. See docs/console.md#sign-in
const otpSchema = new mongoose.Schema(
  {
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
)

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type OtpRecord = InferSchemaType<typeof otpSchema>

export const Otp: Model<OtpRecord> =
  (mongoose.models.Otp as Model<OtpRecord> | undefined) ?? mongoose.model('Otp', otpSchema, 'Otps')
