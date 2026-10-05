import { z } from 'zod'
import type { FieldErrors } from './errors'

// The home page's editable content, one schema per console section. Shared by the console forms (instant feedback)
// and the Server Actions (the check that counts). See docs/console.md#home-content

export type HomeFieldErrors = FieldErrors

export const homeLimits = {
  aboutTitle: 80,
  aboutBody: 1200,
  clientCount: 9999,
  services: 12,
  serviceTitle: 80,
  serviceBody: 400,
  skillGroups: 16,
  groupName: 60,
  groupItems: 40,
  tag: 40,
  practices: 12,
  practice: 60,
  certifications: 24,
  certName: 120,
  certIssuer: 80,
  certDescription: 240,
  certSkills: 4,
  experience: 12,
  experienceRole: 80,
  experienceOrganization: 80,
  experienceSummary: 240,
  experienceHighlights: 4,
  experienceHighlight: 200,
} as const

/** Stands in for the client count inside the About body. See docs/console.md#about */
export const CLIENTS_PLACEHOLDER = '{clients}'

const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'tooLong')

// One value per locale, both required; mirrors `localizedString()` in the models.
const localized = (max: number) => z.object({ en: text(max), ar: text(max) })

const idZSchema = z.string().min(1).max(64)

/** An image uploaded to R2: its public URL and pixel size (for next/image). The action checks the URL's origin. */
export const imageZSchema = z.object({
  url: z.url('invalid'),
  width: z.int().positive().max(20000),
  height: z.int().positive().max(20000),
})

const tagZSchema = text(homeLimits.tag)

export const aboutZSchema = z.object({
  title: localized(homeLimits.aboutTitle),
  body: localized(homeLimits.aboutBody),
  clientCount: z.int('invalid').min(0, 'invalid').max(homeLimits.clientCount, 'invalid'),
  portrait: imageZSchema.nullable(),
})

export const serviceZSchema = z.object({
  id: idZSchema,
  title: localized(homeLimits.serviceTitle),
  body: localized(homeLimits.serviceBody),
})

export const servicesZSchema = z.object({
  services: z.array(serviceZSchema).max(homeLimits.services, 'tooMany'),
})

export const skillGroupZSchema = z
  .object({
    id: idZSchema,
    name: localized(homeLimits.groupName),
    items: z.array(tagZSchema).max(homeLimits.groupItems, 'tooMany'),
    practices: z.array(z.object({ id: idZSchema, label: localized(homeLimits.practice) })).max(homeLimits.practices, 'tooMany'),
  })
  .refine((group) => group.items.length + group.practices.length > 0, { message: 'emptyGroup', path: ['items'] })

export const skillsZSchema = z.object({
  skillGroups: z.array(skillGroupZSchema).max(homeLimits.skillGroups, 'tooMany'),
})

export const certificationZSchema = z.object({
  id: idZSchema,
  // As issued, never translated.
  name: text(homeLimits.certName),
  issuer: text(homeLimits.certIssuer),
  /** `YYYY-MM`, or empty when unknown. */
  issuedOn: z.union([z.literal(''), z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'invalid')]),
  description: localized(homeLimits.certDescription),
  skills: z.array(tagZSchema).max(homeLimits.certSkills, 'tooMany'),
  image: imageZSchema.nullable(),
})

export const certificationsZSchema = z.object({
  certifications: z.array(certificationZSchema).max(homeLimits.certifications, 'tooMany'),
})

/** `YYYY-MM`. */
const monthZSchema = z.string().min(1, 'required').regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'invalid')

// One role on the home page's timeline. The university isn't an entry: it comes from lib/profile. See docs/home.md#experience
export const experienceEntryZSchema = z
  .object({
    id: idZSchema,
    role: localized(homeLimits.experienceRole),
    // As the organization writes it, the same in both languages ("Freelance" for client work).
    organization: text(homeLimits.experienceOrganization),
    url: z.union([z.literal(''), z.url({ protocol: /^https?$/, error: 'invalid' })]),
    startedOn: monthZSchema,
    /** Empty while the role is ongoing. */
    endedOn: z.union([z.literal(''), monthZSchema]),
    summary: localized(homeLimits.experienceSummary),
    highlights: z
      .array(z.object({ id: idZSchema, text: localized(homeLimits.experienceHighlight) }))
      .max(homeLimits.experienceHighlights, 'tooMany'),
    /** A project whose case study the role links to, or empty. */
    projectId: z.string().max(64),
  })
  .refine((entry) => !entry.endedOn || entry.endedOn >= entry.startedOn, { message: 'beforeStart', path: ['endedOn'] })

export const experienceZSchema = z.object({
  experience: z.array(experienceEntryZSchema).max(homeLimits.experience, 'tooMany'),
})

export type AboutInput = z.infer<typeof aboutZSchema>
export type ExperienceInput = z.infer<typeof experienceZSchema>
export type ServicesInput = z.infer<typeof servicesZSchema>
export type SkillsInput = z.infer<typeof skillsZSchema>
export type CertificationsInput = z.infer<typeof certificationsZSchema>
export type ImageInput = z.infer<typeof imageZSchema>

/** Everything the console's home page edits, one key per section. */
export type HomeContentInput = {
  about: AboutInput
  experience: ExperienceInput['experience']
  services: ServicesInput['services']
  skillGroups: SkillsInput['skillGroups']
  certifications: CertificationsInput['certifications']
}

export type HomeSection = 'about' | 'experience' | 'services' | 'skills' | 'certifications'
