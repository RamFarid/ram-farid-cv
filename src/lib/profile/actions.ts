'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { deleteObjects, isBucketUrl } from '@/lib/storage'
import { toFieldErrors, type SaveResult } from '@/lib/validations/errors'
import { cvZSchema, type CvInput } from '@/lib/validations/profile'
import { setCv } from '.'

// The console's CV form. The Download CV buttons sit in the nav of every public page, so a save revalidates them all.
// See docs/console.md#cv
export async function saveCv(input: CvInput): Promise<SaveResult> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }

  const parsed = cvZSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fieldErrors: toFieldErrors(parsed.error) }
  // The URL is linked from every public page, so it must be our own bucket.
  if (parsed.data.cv && !isBucketUrl(parsed.data.cv.url)) return { ok: false, error: 'invalid', fieldErrors: { cv: 'invalid' } }

  try {
    const replaced = await setCv(parsed.data.cv)
    after(() => deleteObjects(replaced).catch((error: unknown) => console.error('Deleting the replaced CV failed:', error)))
  } catch (error) {
    console.error('Saving the CV failed:', error)
    return { ok: false, error: 'unavailable' }
  }

  revalidatePath('/[locale]', 'layout')
  return { ok: true }
}
