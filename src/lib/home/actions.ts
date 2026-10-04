'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import type { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { toFieldErrors } from '@/lib/validations/errors'
import { isBucketUrl } from '@/lib/storage'
import {
  aboutZSchema,
  certificationsZSchema,
  servicesZSchema,
  skillsZSchema,
  type AboutInput,
  type CertificationsInput,
  type HomeFieldErrors,
  type ServicesInput,
  type SkillsInput,
} from '@/lib/validations/home'
import { deleteUnusedImages, saveHomeSection } from '.'
import type { HomeSaveResult } from './types'

// The console's home-content mutation boundary: session, Zod, save, revalidate both locales of the home page.
// See docs/console.md#saving

type Saver<T> = (data: T) => Promise<string[]>

async function save<T>(schema: z.ZodType<T>, input: unknown, saver: Saver<T>, imageErrors?: (data: T) => HomeFieldErrors) {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' } satisfies HomeSaveResult

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'invalid', fieldErrors: toFieldErrors(parsed.error) } satisfies HomeSaveResult
  }

  // Images must come from our own bucket: the URL is rendered on the public page.
  const fieldErrors = imageErrors?.(parsed.data)
  if (fieldErrors && Object.keys(fieldErrors).length) return { ok: false, error: 'invalid', fieldErrors } satisfies HomeSaveResult

  try {
    const unused = await saver(parsed.data)
    after(() =>
      deleteUnusedImages(unused).catch((error: unknown) => console.error('Deleting replaced R2 images failed:', error)),
    )
  } catch (error) {
    console.error('Saving home content failed:', error)
    return { ok: false, error: 'unavailable' } satisfies HomeSaveResult
  }

  revalidatePath('/[locale]', 'page')
  revalidatePath('/[locale]/console', 'page')
  return { ok: true } satisfies HomeSaveResult
}

export async function saveAbout(input: AboutInput): Promise<HomeSaveResult> {
  return save(
    aboutZSchema,
    input,
    (value) => saveHomeSection({ section: 'about', value }),
    (data): HomeFieldErrors => (data.portrait && !isBucketUrl(data.portrait.url) ? { portrait: 'invalid' } : {}),
  )
}

export async function saveServices(input: ServicesInput): Promise<HomeSaveResult> {
  return save(servicesZSchema, input, ({ services }) => saveHomeSection({ section: 'services', value: services }))
}

export async function saveSkills(input: SkillsInput): Promise<HomeSaveResult> {
  return save(skillsZSchema, input, ({ skillGroups }) => saveHomeSection({ section: 'skills', value: skillGroups }))
}

export async function saveCertifications(input: CertificationsInput): Promise<HomeSaveResult> {
  return save(
    certificationsZSchema,
    input,
    ({ certifications }) => saveHomeSection({ section: 'certifications', value: certifications }),
    (data) =>
      Object.fromEntries(
        data.certifications.flatMap((cert, index) =>
          cert.image && !isBucketUrl(cert.image.url) ? [[`certifications.${index}.image`, 'invalid' as const]] : [],
        ),
      ),
  )
}
