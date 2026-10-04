'use client'

import { useId, useRef, useState, type DragEvent } from 'react'
import Image from 'next/image'
import { CircleAlert, ImageUp, LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { getImageUploadUrl, type UploadFolder } from '@/lib/storage/actions'
import type { ImageInput } from '@/lib/validations/home'
import { cn } from '@/utils'

// Uploads one image straight to R2 through a presigned PUT, then hands back its public URL and pixel size. The image
// only goes live when the section is saved; until then the draft just points at it. See docs/console.md#uploads

const accepted = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'] as const
const MAX_BYTES = 8 * 1024 * 1024

type ImageUploadProps = {
  label: string
  value: ImageInput | null
  onChange: (value: ImageInput | null) => void
  folder: UploadFolder
  /** The frame's aspect ratio, as the public page shows it. */
  aspect: 'portrait' | 'landscape'
  /** `cover` crops to the frame (the portrait); `contain` shows the whole image (certificates). */
  fit?: 'cover' | 'contain'
  error?: string
  className?: string
}

type UploadError = 'type' | 'size' | 'failed' | 'unavailable'

async function readSize(file: File) {
  const bitmap = await createImageBitmap(file)
  const size = { width: bitmap.width, height: bitmap.height }
  bitmap.close()
  return size
}

export function ImageUpload({ label, value, onChange, folder, aspect, fit = 'cover', error, className }: ImageUploadProps) {
  const t = useTranslations('Console.upload')
  const inputId = useId()
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<UploadError | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const message = uploadError ? t(`errors.${uploadError}`) : error

  const upload = async (file: File) => {
    setUploadError(null)
    if (!(accepted as readonly string[]).includes(file.type)) return setUploadError('type')
    if (file.size > MAX_BYTES) return setUploadError('size')

    setUploading(true)
    try {
      const [size, presigned] = await Promise.all([
        readSize(file),
        getImageUploadUrl({ folder, contentType: file.type as (typeof accepted)[number], size: file.size }),
      ])
      if (!presigned.ok) return setUploadError(presigned.error === 'unavailable' ? 'unavailable' : 'failed')

      const response = await fetch(presigned.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!response.ok) return setUploadError('failed')
      onChange({ url: presigned.url, ...size })
    } catch {
      setUploadError('failed')
    } finally {
      setUploading(false)
      if (input.current) input.current.value = ''
    }
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && !uploading) void upload(file)
  }

  return (
    <div className={cn('grid content-start gap-space-2', className)}>
      <p id={`${inputId}-label`} className="text-label text-ink">
        {label}
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'relative grid place-items-center overflow-hidden rounded-lg border bg-surface-raised',
          aspect === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]',
          value ? 'border-line' : 'border-dashed border-line-strong',
          dragOver && 'border-solid border-primary bg-primary-soft',
          (error || uploadError) && 'border-danger',
        )}
      >
        {value ? (
          <Image
            src={value.url}
            alt=""
            fill
            unoptimized
            className={cn(fit === 'cover' ? 'object-cover' : 'object-contain p-space-3')}
          />
        ) : (
          <div className="grid justify-items-center gap-space-2 p-space-4 text-center text-small text-ink-muted">
            <ImageUp aria-hidden size={24} strokeWidth={1.75} />
            <span>{t('empty')}</span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-bg/80" role="status">
            <span className="inline-flex items-center gap-space-2 text-label text-ink">
              <LoaderCircle aria-hidden size={18} strokeWidth={1.75} className="animate-spin motion-reduce:animate-none" />
              {t('uploading')}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-space-2">
        <input
          ref={input}
          id={inputId}
          type="file"
          accept={accepted.join(',')}
          className="sr-only"
          tabIndex={-1}
          aria-labelledby={`${inputId}-label`}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) void upload(file)
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          disabled={uploading}
          aria-describedby={`${inputId}-label`}
          onClick={() => input.current?.click()}
        >
          {value ? t('replace') : t('choose')}
        </Button>
        {value && (
          <Button
            variant="quiet"
            size="sm"
            disabled={uploading}
            aria-describedby={`${inputId}-label`}
            onClick={() => onChange(null)}
          >
            {t('remove')}
          </Button>
        )}
      </div>

      {message ? (
        <p role="alert" className="flex items-start gap-space-2 text-small text-danger">
          <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
          {message}
        </p>
      ) : (
        <p className="text-small text-ink-muted">{t('hint')}</p>
      )}
    </div>
  )
}
