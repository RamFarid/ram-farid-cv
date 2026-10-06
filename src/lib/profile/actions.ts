'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { setProfileAvailability } from '@/lib/db/profile'
import { toFieldErrors, type SaveResult } from '@/lib/validations/errors'
import { availabilityZSchema, type AvailabilityInput } from '@/lib/validations/profile'

// The console's availability: it changes the home page's badge (and its FAQ) and /llms.txt. See docs/console.md#availability
export async function saveAvailability(input: AvailabilityInput): Promise<SaveResult<AvailabilityInput>> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }

  const parsed = availabilityZSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fieldErrors: toFieldErrors(parsed.error) }

  try {
    await setProfileAvailability(parsed.data)
  } catch (error) {
    console.error('Saving the availability failed:', error)
    return { ok: false, error: 'unavailable' }
  }

  revalidatePath('/[locale]', 'page')
  revalidatePath('/[locale]/console', 'page')
  revalidatePath('/llms.txt')
  return { ok: true, value: parsed.data }
}
