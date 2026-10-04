import { z } from 'zod'

// The console's CV form, shared by the form (instant feedback) and its Server Action. See docs/console.md#cv

export const cvLimits = {
  /** Bytes. A CV PDF is usually well under 1 MB. */
  size: 10 * 1024 * 1024,
  name: 200,
} as const

export const CV_CONTENT_TYPE = 'application/pdf'
/** Visitors save the CV under this name whatever its key. Signed into the upload, so the browser's PUT sends it too. */
export const CV_CONTENT_DISPOSITION = 'attachment; filename="Ram-Farid-CV.pdf"'

/** The CV in R2. The action checks that the URL is in our bucket. */
export const cvFileZSchema = z.object({
  url: z.url('invalid'),
  name: z.string().trim().min(1, 'required').max(cvLimits.name, 'tooLong'),
  size: z.int().positive().max(cvLimits.size, 'invalid'),
  /** ISO date-time, so the draft stays plain JSON. */
  uploadedAt: z.iso.datetime({ offset: true }),
})

export const cvZSchema = z.object({ cv: cvFileZSchema.nullable() })

export type CvFile = z.infer<typeof cvFileZSchema>
export type CvInput = z.infer<typeof cvZSchema>
