'use server'

import { getSession } from '@/lib/auth/session'
import { toFieldErrors, type SaveResult } from '@/lib/validations/errors'
import { cvConfigZSchema, cvOneTimeZSchema, type CvConfigInput, type CvOneTimeInput } from '@/lib/validations/cv'
import { getCvSources, normalizeCvConfig, renderCv, saveCvConfig } from '.'

// The console's CV page: Save makes the setup the public CV; a one-time CV is built from the setup on screen and
// never stored. See docs/cv.md#console

export async function saveCv(input: CvConfigInput): Promise<SaveResult<CvConfigInput>> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }

  const parsed = cvConfigZSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fieldErrors: toFieldErrors(parsed.error) }

  try {
    const sources = await getCvSources()
    const config = normalizeCvConfig(parsed.data, sources)
    // Render once before saving, so a setup that can't become a PDF never replaces the public CV.
    await renderCv(config, sources)
    await saveCvConfig(config)
    // The public CV is rendered per request for now; its cache and purge come with the SEO turn (docs/cv.md#caching).
    return { ok: true, value: config }
  } catch (error) {
    console.error('Saving the CV failed:', error)
    return { ok: false, error: 'unavailable' }
  }
}

export type OneTimeCvResult =
  | { ok: true; pdf: Uint8Array; fileName: string; pages: number }
  | { ok: false; error: 'unauthorized' | 'invalid' | 'unavailable' }

/** A CV from an unsaved setup, for one application. Nothing is stored and the public CV is untouched. */
export async function downloadOneTimeCv(input: CvOneTimeInput): Promise<OneTimeCvResult> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }

  const parsed = cvOneTimeZSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }

  try {
    const { pdf, pages, fileName } = await renderCv(parsed.data.config, await getCvSources(), parsed.data.company)
    return { ok: true, pdf: new Uint8Array(pdf), fileName, pages }
  } catch (error) {
    console.error('Building a one-time CV failed:', error)
    return { ok: false, error: 'unavailable' }
  }
}
