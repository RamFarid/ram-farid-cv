'use server'

import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { createImageUpload, imageTypes, MAX_IMAGE_BYTES, type ImageType } from '.'

// Folders the console may upload into, one per place an image is used. See docs/console.md#uploads
const uploadFolders = ['home/portrait', 'home/certificates'] as const
export type UploadFolder = (typeof uploadFolders)[number]

const uploadZSchema = z.object({
  folder: z.enum(uploadFolders),
  contentType: z.enum(Object.keys(imageTypes) as [ImageType, ...ImageType[]]),
  size: z.int().positive().max(MAX_IMAGE_BYTES),
})

export type UploadUrlResult =
  | { ok: true; uploadUrl: string; url: string }
  | { ok: false; error: 'unauthorized' | 'invalid' | 'unavailable' }

/** A presigned R2 PUT for one image. The browser uploads to it, then saves the returned public URL with its section. */
export async function getImageUploadUrl(input: z.input<typeof uploadZSchema>): Promise<UploadUrlResult> {
  if (!(await getSession())) return { ok: false, error: 'unauthorized' }
  const parsed = uploadZSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'invalid' }

  try {
    const upload = await createImageUpload(parsed.data.folder, parsed.data.contentType, parsed.data.size)
    if (!upload) {
      console.error('R2 is not configured: set the R2_* variables in .env.')
      return { ok: false, error: 'unavailable' }
    }
    return { ok: true, ...upload }
  } catch (error) {
    console.error('Presigning an R2 upload failed:', error)
    return { ok: false, error: 'unavailable' }
  }
}
