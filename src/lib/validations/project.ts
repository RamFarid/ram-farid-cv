import { z } from 'zod'
import { stackIds } from '@/lib/projects/stack'

// A project as the console edits it, shared by the edit page (instant feedback) and the Server Actions (the check
// that counts). A draft saves with little more than an English title; publishing needs the full case study in both
// languages. See docs/portfolio.md#console

export const projectLimits = {
  slug: 80,
  title: 80,
  kind: 40,
  client: 80,
  summary: 220,
  url: 300,
  stack: 32,
  alt: 160,
  caption: 140,
  // Desktop and phone shots together. See docs/portfolio.md#case-study-content
  screenshots: 15,
  role: 80,
  overview: 2000,
  deliverables: 12,
  deliverable: 160,
  story: 20000,
} as const

export const screenshotDevices = ['desktop', 'mobile'] as const

const blank = (max: number) => z.string().trim().max(max, 'tooLong')
const filled = (max: number) => z.string().trim().min(1, 'required').max(max, 'tooLong')
const localized = (max: number, full: boolean) =>
  full ? z.object({ en: filled(max), ar: filled(max) }) : z.object({ en: blank(max), ar: blank(max) })

/** Lowercase words joined by hyphens: the /portfolio/[project_id] segment. */
export const slugZSchema = z
  .string()
  .trim()
  .min(1, 'required')
  .max(projectLimits.slug, 'tooLong')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'invalid')

const urlZSchema = z.union([z.literal(''), z.url({ protocol: /^https?$/, error: 'invalid' }).max(projectLimits.url, 'tooLong')])

/** `YYYY-MM-DD`, or empty. */
const dateZSchema = z.union([z.literal(''), z.iso.date('invalid')])

const imageFields = {
  url: z.url('invalid'),
  width: z.int().positive().max(20000),
  height: z.int().positive().max(20000),
}

function projectZSchema(full: boolean) {
  const coverZSchema = z.object({ ...imageFields, alt: localized(projectLimits.alt, full) })

  return z
    .object({
      slug: slugZSchema,
      // The English title is the one thing a draft needs: it names the project in the console.
      title: full
        ? localized(projectLimits.title, true)
        : z.object({ en: filled(projectLimits.title), ar: blank(projectLimits.title) }),
      kind: localized(projectLimits.kind, full),
      client: localized(projectLimits.client, full),
      summary: localized(projectLimits.summary, full),
      liveUrl: urlZSchema,
      repoUrl: urlZSchema,
      starred: z.boolean(),
      startedAt: full ? dateZSchema.refine((value) => value !== '', 'required') : dateZSchema,
      /** Empty while the work is ongoing. */
      endedAt: dateZSchema,
      stack: z
        .array(z.enum(stackIds))
        .min(full ? 1 : 0, 'required')
        .max(projectLimits.stack, 'tooMany'),
      cover: full ? coverZSchema.nullable().refine((value) => value !== null, 'required') : coverZSchema.nullable(),
      screenshots: z
        .array(
          z.object({
            ...imageFields,
            device: z.enum(screenshotDevices),
            alt: localized(projectLimits.alt, full),
            caption: localized(projectLimits.caption, false),
          }),
        )
        .max(projectLimits.screenshots, 'tooMany'),
      role: localized(projectLimits.role, full),
      overview: localized(projectLimits.overview, full),
      deliverables: z
        .array(z.object({ id: z.string().min(1).max(64), text: localized(projectLimits.deliverable, full) }))
        .min(full ? 1 : 0, 'required')
        .max(projectLimits.deliverables, 'tooMany'),
      /** Markdown; the action turns it into sanitized HTML. */
      story: localized(projectLimits.story, full),
    })
    .refine((project) => !project.startedAt || !project.endedAt || project.endedAt >= project.startedAt, {
      path: ['endedAt'],
      message: 'beforeStart',
    })
}

export const projectDraftZSchema = projectZSchema(false)
export const projectPublishZSchema = projectZSchema(true)

export type ProjectInput = z.infer<typeof projectDraftZSchema>
export type ProjectScreenshotInput = ProjectInput['screenshots'][number]
export type ProjectStatus = 'draft' | 'published'

/** The top-level field a dotted error path belongs to, with its locale when it names one (`story.ar`). */
export function missingField(path: string): { field: string; locale?: 'en' | 'ar' } {
  const parts = path.split('.')
  const last = parts.at(-1)
  return { field: parts[0], locale: parts.length === 2 && (last === 'en' || last === 'ar') ? last : undefined }
}

/** A slug from a title: lowercase Latin letters and digits joined by hyphens. Empty for a title with none. */
export function slugify(title: string) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, projectLimits.slug)
    .replace(/-+$/, '')
}
