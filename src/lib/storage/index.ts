import 'server-only'
import { randomUUID } from 'node:crypto'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'
import { CV_CONTENT_DISPOSITION, CV_CONTENT_TYPE } from '@/lib/validations/profile'

// Cloudflare R2 through its S3 API. The browser uploads straight to R2 with a short-lived presigned PUT, so files never
// pass through the app server. See docs/console.md#uploads

const r2EnvZSchema = z.object({
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_URL: z.url(),
})

const cache = globalThis as typeof globalThis & { r2?: { client: S3Client; bucket: string; publicUrl: string } }

/** Null when any R2 variable is unset, so the console can say uploads are off instead of crashing. */
function getR2() {
  if (cache.r2) return cache.r2
  const env = r2EnvZSchema.safeParse(process.env)
  if (!env.success) return null

  cache.r2 = {
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${env.data.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: env.data.R2_ACCESS_KEY_ID, secretAccessKey: env.data.R2_SECRET_ACCESS_KEY },
      // The SDK's default CRC32 checksums would be signed into presigned URLs, which a browser PUT can't match.
      // https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    }),
    bucket: env.data.R2_BUCKET,
    publicUrl: env.data.R2_PUBLIC_URL.replace(/\/$/, ''),
  }
  return cache.r2
}

export const imageTypes = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
} as const

export type ImageType = keyof typeof imageTypes

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024

/** A presigned PUT for one new object, valid for five minutes. Content type, length and headers are signed. */
async function presignPut(key: string, contentType: string, size: number, contentDisposition?: string) {
  const r2 = getR2()
  if (!r2) return null

  const uploadUrl = await getSignedUrl(
    r2.client,
    new PutObjectCommand({
      Bucket: r2.bucket,
      Key: key,
      ContentType: contentType,
      ContentLength: size,
      ContentDisposition: contentDisposition,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn: 300 },
  )
  return { uploadUrl, url: `${r2.publicUrl}/${key}` }
}

/** A new image under `folder`. The browser can only upload exactly the file it described. */
export function createImageUpload(folder: string, contentType: ImageType, size: number) {
  return presignPut(`${folder}/${randomUUID()}.${imageTypes[contentType]}`, contentType, size)
}

/** A new CV PDF. Every upload gets a new key, so the immutable cache header never serves a replaced CV. */
export function createCvUpload(size: number) {
  return presignPut(`cv/${randomUUID()}.pdf`, CV_CONTENT_TYPE, size, CV_CONTENT_DISPOSITION)
}

/** The object key behind a public URL, or null when the URL isn't in this bucket. */
export function keyFromPublicUrl(url: string) {
  const r2 = getR2()
  if (!r2 || !url.startsWith(`${r2.publicUrl}/`)) return null
  return url.slice(r2.publicUrl.length + 1)
}

export function isBucketUrl(url: string) {
  return keyFromPublicUrl(url) !== null
}

/** Deletes objects by public URL; URLs outside the bucket are skipped. */
export async function deleteObjects(urls: string[]) {
  const r2 = getR2()
  const keys = urls.map(keyFromPublicUrl).filter((key): key is string => key !== null)
  if (!r2 || keys.length === 0) return

  // One request per object: a handful at most per save, and DeleteObjects needs a checksum header R2 handles unevenly.
  await Promise.all(keys.map((Key) => r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key }))))
}
