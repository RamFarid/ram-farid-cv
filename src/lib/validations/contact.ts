import { z } from 'zod'

// Shared by the contact form (instant feedback) and the Server Action (the check that counts). See docs/contact.md#validation

// Each issue's message is a key of `Home.contact.errors`, translated where it is shown.
export const contactErrorKeys = [
  'nameRequired',
  'nameLong',
  'emailRequired',
  'emailInvalid',
  'phoneInvalid',
  'messageRequired',
  'messageShort',
  'messageLong',
] as const

export type ContactErrorKey = (typeof contactErrorKeys)[number]

export const contactLimits = {
  name: 100,
  email: 254,
  phone: 24,
  messageMin: 10,
  message: 4000,
} as const

// A country code is required so the number works as a wa.me link: "+20 100 000 0000" or "0020 100 000 0000".
const phoneZSchema = z
  .string()
  .regex(/^(\+|00)[1-9][\d\s().-]*$/, 'phoneInvalid')
  .refine((phone) => {
    const digits = phone.replace(/\D/g, '').replace(/^00/, '')
    return digits.length >= 8 && digits.length <= 15
  }, 'phoneInvalid')

export const contactZSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired').max(contactLimits.name, 'nameLong'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'emailRequired')
    .max(contactLimits.email, 'emailInvalid')
    .pipe(z.email('emailInvalid')),
  phone: z
    .string()
    .trim()
    .max(contactLimits.phone, 'phoneInvalid')
    .transform((phone) => phone || undefined)
    .pipe(phoneZSchema.optional()),
  message: z
    .string()
    .trim()
    .min(1, 'messageRequired')
    .min(contactLimits.messageMin, 'messageShort')
    .max(contactLimits.message, 'messageLong'),
})

export type ContactInput = z.infer<typeof contactZSchema>
export type ContactField = keyof ContactInput
export type ContactFieldErrors = Partial<Record<ContactField, ContactErrorKey>>

export const contactFields = Object.keys(contactZSchema.shape) as ContactField[]

const isErrorKey = (message: string): message is ContactErrorKey =>
  (contactErrorKeys as readonly string[]).includes(message)

/** Reads the form's fields as strings; a missing field is an empty one. */
export function readContactForm(formData: FormData) {
  return Object.fromEntries(
    contactFields.map((field) => {
      const value = formData.get(field)
      return [field, typeof value === 'string' ? value : '']
    }),
  ) as Record<ContactField, string>
}

/** The first issue per field, as an error key. */
export function contactFieldErrors(error: z.ZodError): ContactFieldErrors {
  const errors: ContactFieldErrors = {}
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField
    errors[field] ??= isErrorKey(issue.message) ? issue.message : fallbackKeys[field]
  }
  return errors
}

/** Re-checks one field on its own, as the visitor corrects it. */
export function checkContactField(field: ContactField, value: string): ContactErrorKey | undefined {
  const result = contactZSchema.shape[field].safeParse(value)
  if (result.success) return undefined
  const message = result.error.issues[0]?.message ?? ''
  return isErrorKey(message) ? message : fallbackKeys[field]
}

const fallbackKeys: Record<ContactField, ContactErrorKey> = {
  name: 'nameRequired',
  email: 'emailInvalid',
  phone: 'phoneInvalid',
  message: 'messageRequired',
}
