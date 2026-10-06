import { getImageUploadUrl, type UploadFolder } from './actions'
import { immutableCacheControl } from './cache'

// The browser side of an image upload: checks the file, asks for a presigned R2 PUT, uploads, and reads the pixel size
// for next/image. The image only goes live when the form that holds it is saved. See docs/console.md#uploads

export const acceptedImageTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'] as const
const MAX_BYTES = 8 * 1024 * 1024

export type UploadError = 'type' | 'size' | 'failed' | 'unavailable'
export type UploadedImage = { url: string; width: number; height: number }

async function readSize(file: File) {
  const bitmap = await createImageBitmap(file)
  const size = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  return size
}

export async function uploadImage(
  file: File,
  folder: UploadFolder,
): Promise<{ ok: true; image: UploadedImage } | { ok: false; error: UploadError }> {
  if (!(acceptedImageTypes as readonly string[]).includes(file.type)) return { ok: false, error: 'type' }
  if (file.size > MAX_BYTES) return { ok: false, error: 'size' }

  try {
    const [size, presigned] = await Promise.all([
      readSize(file),
      getImageUploadUrl({ folder, contentType: file.type as (typeof acceptedImageTypes)[number], size: file.size }),
    ])
    if (!presigned.ok) return { ok: false, error: presigned.error === 'unavailable' ? 'unavailable' : 'failed' }

    // The presigner never signs Cache-Control, so the object only gets the immutable header if the browser sends it.
    // The bucket's CORS rule allows it. See docs/console.md#uploads
    const response = await fetch(presigned.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type, 'Cache-Control': immutableCacheControl },
      body: file,
    })
    if (!response.ok) return { ok: false, error: 'failed' }
    return { ok: true, image: { url: presigned.url, ...size } }
  } catch {
    return { ok: false, error: 'failed' }
  }
}
