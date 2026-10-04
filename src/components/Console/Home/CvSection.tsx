'use client'

import { useId, useRef, useState, type DragEvent } from 'react'
import { CircleAlert, Download, FileText, FileUp, LoaderCircle } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useFieldErrors } from '@/components/Console/fieldErrors'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { Button, ButtonLink } from '@/components/ui/Button'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { CONSOLE_TIME_ZONE } from '@/lib/console/constants'
import { saveCv } from '@/lib/profile/actions'
import { uploadCv, type UploadError } from '@/lib/storage/upload'
import { CV_CONTENT_TYPE, cvZSchema, type CvInput } from '@/lib/validations/profile'
import { cn } from '@/utils'

// The file behind every Download CV button. The PDF goes straight to R2 and only goes live on Save, like an image.
// See docs/console.md#cv
export function CvSection({ initial }: { initial: CvInput }) {
  const t = useTranslations('Console.cv')
  const format = useFormatter()
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft('cv', initial, cvZSchema, saveCv)
  const fieldError = useFieldErrors(errors)
  const inputId = useId()
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<UploadError | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const message = uploadError ? t(`errors.${uploadError}`) : fieldError.one('cv')
  const cv = draft.cv

  const upload = async (file: File) => {
    setUploadError(null)
    setUploading(true)
    const result = await uploadCv(file)
    setUploading(false)
    if (input.current) input.current.value = ''
    if (result.ok) update({ cv: result.cv })
    else setUploadError(result.error)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && !uploading) void upload(file)
  }

  const size = (bytes: number) =>
    bytes < 1024 * 1024
      ? format.number(Math.max(1, Math.round(bytes / 1024)), { style: 'unit', unit: 'kilobyte' })
      : format.number(bytes / (1024 * 1024), { style: 'unit', unit: 'megabyte', maximumFractionDigits: 1 })

  return (
    <SectionPanel
      id="cv"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={() => save({ success: t('saved') })}
      onDiscard={() => {
        discard()
        setUploadError(null)
      }}
    >
      <div className="grid max-w-measure gap-space-2">
        <p id={`${inputId}-label`} className="text-label text-ink">
          {t('file')}
        </p>

        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            'relative flex min-h-24 items-center gap-space-4 rounded-lg border bg-surface-raised p-space-4',
            cv ? 'border-line' : 'border-dashed border-line-strong',
            dragOver && 'border-solid border-primary bg-primary-soft',
            message && 'border-danger',
          )}
        >
          {cv ? (
            <>
              <span className="grid size-12 shrink-0 place-items-center rounded-md border border-line bg-surface text-ink-muted">
                <FileText aria-hidden size={22} strokeWidth={1.75} />
              </span>
              <div className="grid min-w-0 flex-1 gap-space-1">
                <p dir="auto" className="truncate text-label text-ink" title={cv.name}>
                  {cv.name}
                </p>
                <p className="font-mono text-code text-ink-muted tabular-nums">
                  {t('meta', {
                    size: size(cv.size),
                    date: format.dateTime(new Date(cv.uploadedAt), { dateStyle: 'medium', timeZone: CONSOLE_TIME_ZONE }),
                  })}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center gap-space-3 text-small text-ink-muted">
              <FileUp aria-hidden size={22} strokeWidth={1.75} className="shrink-0" />
              <span>{t('empty')}</span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 grid place-items-center rounded-lg bg-bg/80" role="status">
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
            accept={CV_CONTENT_TYPE}
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
            {cv ? t('replace') : t('choose')}
          </Button>
          {cv && (
            <>
              <ButtonLink
                href={cv.url}
                variant="quiet"
                size="sm"
                icon={<Download aria-hidden size={16} strokeWidth={1.75} />}
              >
                {t('download')}
              </ButtonLink>
              <Button
                variant="quiet"
                size="sm"
                disabled={uploading}
                aria-describedby={`${inputId}-label`}
                onClick={() => update({ cv: null })}
              >
                {t('remove')}
              </Button>
            </>
          )}
        </div>

        {message ? (
          <p role="alert" className="flex items-start gap-space-2 text-small text-danger">
            <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
            {message}
          </p>
        ) : (
          <p className="text-small text-ink-muted">{cv ? t('hint') : t('hintEmpty')}</p>
        )}
      </div>
    </SectionPanel>
  )
}
