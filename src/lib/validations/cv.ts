import { z } from 'zod'

// The CV setup the console edits: what the generated CV takes from the site's content and how it lays it out. Shared
// by the editor (instant feedback) and its Server Actions (the check that counts). English only. See docs/cv.md#setup

export const cvLimits = {
  headline: 80,
  tools: 6,
  tool: 40,
  summary: 1500,
  experience: 12,
  projects: 8,
  projectTitle: 80,
  projectLinks: 3,
  url: 300,
  projectBullets: 5,
  projectBullet: 300,
  skillGroups: 16,
  groupLabel: 60,
  certifications: 24,
  company: 60,
} as const

/** Stands in for Ram's whole years of experience inside the summary ("4" in 2026, "5" from November 2026). */
export const CV_YEARS_PLACEHOLDER = '{years}'

/** The contact line, in this order. */
export const cvContactIds = ['location', 'phone', 'email', 'website', 'linkedin', 'github'] as const
export type CvContactId = (typeof cvContactIds)[number]

/** The sections under the header. Each one's place and visibility are part of the setup. */
export const cvSectionIds = [
  'summary',
  'skills',
  'experience',
  'additionalExperience',
  'projects',
  'certifications',
  'education',
  'languages',
] as const
export type CvSectionId = (typeof cvSectionIds)[number]

/** Main roles go under Professional Experience, additional ones under Additional Experience. */
export const cvExperienceTiers = ['main', 'additional', 'hidden'] as const
export type CvExperienceTier = (typeof cvExperienceTiers)[number]

export const cvPageSizes = ['A4', 'LETTER'] as const
export type CvPageSize = (typeof cvPageSizes)[number]

const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'tooLong')
const blank = (max: number) => z.string().trim().max(max, 'tooLong')
const idZSchema = z.string().min(1).max(64)
const urlZSchema = z.url({ protocol: /^https?$/, error: 'invalid' }).max(cvLimits.url, 'tooLong')

const unique = <T>(values: T[]) => new Set(values).size === values.length

export const cvConfigZSchema = z.object({
  /** The line under the name, e.g. "Full Stack Engineer". */
  headline: text(cvLimits.headline),
  /** The tools line under the headline. */
  tools: z.array(text(cvLimits.tool)).max(cvLimits.tools, 'tooMany'),
  /** May hold `{years}`. Empty hides the section. */
  summary: blank(cvLimits.summary),
  contacts: z.array(z.enum(cvContactIds)).refine(unique, 'invalid'),
  sections: z
    .array(z.object({ id: z.enum(cvSectionIds), visible: z.boolean() }))
    .max(cvSectionIds.length)
    .refine((sections) => unique(sections.map((section) => section.id)), 'invalid'),
  /** Every role on the home page's timeline, keyed by its id. A role missing here counts as main, all highlights shown. */
  experience: z
    .array(
      z.object({
        id: idZSchema,
        tier: z.enum(cvExperienceTiers),
        /** Highlights left off the CV; new highlights show by default. */
        hiddenHighlights: z.array(idZSchema).max(12),
      }),
    )
    .max(cvLimits.experience, 'tooMany'),
  /** In CV order. Drafts can be picked: the CV links the live product, not the case study. */
  projects: z
    .array(
      z.object({
        projectId: idZSchema,
        /** Empty uses the project's English title. */
        title: blank(cvLimits.projectTitle),
        links: z.array(urlZSchema).max(cvLimits.projectLinks, 'tooMany'),
        bullets: z
          .array(z.object({ id: idZSchema, text: text(cvLimits.projectBullet) }))
          .max(cvLimits.projectBullets, 'tooMany'),
      }),
    )
    .max(cvLimits.projects, 'tooMany')
    .refine((projects) => unique(projects.map((project) => project.projectId)), 'invalid'),
  /** The skill groups on the CV, in CV order. Items and practices added to a group later show by default. */
  skills: z
    .array(
      z.object({
        groupId: idZSchema,
        /** Empty uses the group's English name. */
        label: blank(cvLimits.groupLabel),
        hiddenItems: z.array(z.string().max(40)).max(40),
        hiddenPractices: z.array(idZSchema).max(12),
      }),
    )
    .max(cvLimits.skillGroups, 'tooMany')
    .refine((groups) => unique(groups.map((group) => group.groupId)), 'invalid'),
  /** Certificate ids, in CV order. */
  certifications: z.array(idZSchema).max(cvLimits.certifications, 'tooMany').refine(unique, 'invalid'),
  pageSize: z.enum(cvPageSizes),
})

/** A one-time CV: the setup on screen, saved or not, and a company name for the file name only. */
export const cvOneTimeZSchema = z.object({
  config: cvConfigZSchema,
  company: blank(cvLimits.company),
})

export type CvConfigInput = z.infer<typeof cvConfigZSchema>
export type CvOneTimeInput = z.infer<typeof cvOneTimeZSchema>

/** The downloaded file's name: `Ram-Farid-CV.pdf`, or `Ram-Farid-CV-Acme-Corp.pdf` for a one-time CV. */
export function cvFileName(company = '') {
  const suffix = company
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `Ram-Farid-CV${suffix ? `-${suffix}` : ''}.pdf`
}
