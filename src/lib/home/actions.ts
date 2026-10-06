'use server'

import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import type { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { toFieldErrors } from '@/lib/validations/errors'
import { isBucketUrl } from '@/lib/storage'
import type { SaveResult } from '@/lib/validations/errors'
import {
  aboutZSchema,
  certificationsZSchema,
  experienceZSchema,
  servicesZSchema,
  skillsZSchema,
  type AboutInput,
  type CertificationsInput,
  type ExperienceInput,
  type HomeFieldErrors,
  type ServicesInput,
  type SkillsInput,
} from '@/lib/validations/home'
import { deleteUnusedImages, saveHomeSection } from '.'

// The console's home-content mutation boundary: session, Zod, save, revalidate both locales of the home page and
// what's built from the same content.
// See docs/console.md#saving

type Saver<T> = (data: T) => Promise<string[]>

async function save<T>(
  schema: z.ZodType<T>,
  input: unknown,
  saver: Saver<T>,
  imageErrors?: (data: T) => HomeFieldErrors,
): Promise<SaveResult<T>> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }

  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid', fieldErrors: toFieldErrors(parsed.error) }

  // Images must come from our own bucket: the URL is rendered on the public page.
  const fieldErrors = imageErrors?.(parsed.data)
  if (fieldErrors && Object.keys(fieldErrors).length) return { ok: false, error: 'invalid', fieldErrors }

  try {
    const unused = await saver(parsed.data)
    after(() =>
      deleteUnusedImages(unused).catch((error: unknown) => console.error('Deleting replaced R2 images failed:', error)),
    )
  } catch (error) {
    console.error('Saving home content failed:', error)
    return { ok: false, error: 'unavailable' }
  }

  revalidatePath('/[locale]', 'page')
  revalidatePath('/[locale]/console', 'page')
  // The CV reads the experience, skills and certificates, the sitemap dates the home page, and llms.txt carries the
  // FAQ (the client count). See docs/cv.md#caching, docs/seo.md#site-wide-files
  revalidatePath('/api/cv')
  revalidatePath('/sitemap.xml')
  revalidatePath('/llms.txt')
  return { ok: true, value: parsed.data }
}

export async function saveAbout(input: AboutInput): Promise<SaveResult<AboutInput>> {
  return save(
    aboutZSchema,
    input,
    (value) => saveHomeSection({ section: 'about', value }),
    (data): HomeFieldErrors => (data.portrait && !isBucketUrl(data.portrait.url) ? { portrait: 'invalid' } : {}),
  )
}

// Saved in date order, so the console's list matches the timeline after each save.
export async function saveExperience(input: ExperienceInput): Promise<SaveResult<ExperienceInput>> {
  return save(experienceZSchema, input, async ({ experience }) => {
    experience.sort((a, b) => a.startedOn.localeCompare(b.startedOn))
    return saveHomeSection({ section: 'experience', value: experience })
  })
}

export async function saveServices(input: ServicesInput): Promise<SaveResult<ServicesInput>> {
  return save(servicesZSchema, input, ({ services }) => saveHomeSection({ section: 'services', value: services }))
}

export async function saveSkills(input: SkillsInput): Promise<SaveResult<SkillsInput>> {
  return save(skillsZSchema, input, ({ skillGroups }) => saveHomeSection({ section: 'skills', value: skillGroups }))
}

export async function saveCertifications(input: CertificationsInput): Promise<SaveResult<CertificationsInput>> {
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
