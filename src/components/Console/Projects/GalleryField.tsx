'use client'

import { useRef, useState, type DragEvent, type ReactNode } from 'react'
import Image from 'next/image'
import { CircleAlert, ImageUp, LoaderCircle, Monitor, Smartphone } from 'lucide-react'
import { useTranslations, type Locale } from 'next-intl'
import { ListRow } from '@/components/Console/ListParts'
import { SortableList } from '@/components/Console/SortableList'
import { Button } from '@/components/ui/Button'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { acceptedImageTypes, uploadImage, type UploadError } from '@/lib/storage/upload'
import { projectLimits, screenshotDevices, type ProjectScreenshotInput } from '@/lib/validations/project'
import { cn } from '@/utils'

// The case study's screens: several uploads at once, then each with its device, alt text and caption, in the order the
// gallery shows them. See docs/portfolio.md#console

type GalleryFieldProps = {
  value: ProjectScreenshotInput[]
  onChange: (change: (shots: ProjectScreenshotInput[]) => ProjectScreenshotInput[]) => void
  /** Translated errors by path inside the list (`2.alt`), from the editor's field errors. */
  error: (path: string) => string | undefined
  localizedError: (path: string) => Partial<Record<Locale, string>>
  listError?: string
}

const deviceIcons = { desktop: Monitor, mobile: Smartphone }

export function GalleryField({ value, onChange, error, localizedError, listError }: GalleryFieldProps) {
  const t = useTranslations('Console.project.gallery')
  const tUpload = useTranslations('Console.upload')
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(0)
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([])
  // Files past the 15-screen limit, which were left out.
  const [skipped, setSkipped] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const room = projectLimits.screenshots - value.length - uploading

  const upload = async (files: File[]) => {
    const batch = files.slice(0, Math.max(room, 0))
    setSkipped(files.length - batch.length)
    setUploadErrors([])
    if (batch.length === 0) return
    setUploading((count) => count + batch.length)
    await Promise.all(
      batch.map(async (file) => {
        const result = await uploadImage(file, 'projects/screens')
        setUploading((count) => count - 1)
        if (!result.ok) return setUploadErrors((errors) => [...errors, result.error])
        const { image } = result
        onChange((shots) => [
          ...shots,
          {
            ...image,
            // A portrait image is almost always a phone screen; Ram can switch it.
            device: image.height > image.width ? 'mobile' : 'desktop',
            alt: { en: '', ar: '' },
            caption: { en: '', ar: '' },
          },
        ])
      }),
    )
    if (input.current) input.current.value = ''
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    void upload([...event.dataTransfer.files])
  }

  const setShot = (url: string, patch: Partial<ProjectScreenshotInput>) =>
    onChange((shots) => shots.map((shot) => (shot.url === url ? { ...shot, ...patch } : shot)))
  const label = (index: number) => t('screen', { number: index + 1 })

  return (
    <div className="grid content-start gap-space-4">
      <div className="flex flex-wrap items-baseline justify-between gap-space-2">
        <h3 className="text-label text-ink">{t('title')}</h3>
        <span dir="ltr" className="font-mono text-code text-ink-muted tabular-nums">
          {value.length} / {projectLimits.screenshots}
        </span>
      </div>

      {value.length > 0 && (
        <SortableList
          items={value}
          getId={(shot) => shot.url}
          getLabel={(_, index) => label(index)}
          onReorder={(next) => onChange(() => next)}
          className="border-t border-line"
          renderItem={(shot, index, handle) => (
            <ListRow
              handle={handle}
              index={index}
              removeLabel={t('remove', { name: label(index) })}
              onRemove={() => onChange((shots) => shots.filter((item) => item.url !== shot.url))}
            >
              <div className="grid gap-space-5 md:grid-cols-[11rem_minmax(0,1fr)]">
                <div className="grid content-start gap-space-3">
                  <div
                    className={cn(
                      'relative overflow-hidden rounded-md border border-line bg-surface-raised',
                      error(`screenshots.${index}`) && 'border-danger',
                      shot.device === 'mobile' ? 'mx-auto w-24' : 'w-full',
                    )}
                    style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
                  >
                    <Image src={shot.url} alt="" fill unoptimized sizes="11rem" className="object-cover" />
                  </div>
                  <p dir="ltr" className="text-center font-mono text-code text-ink-muted tabular-nums">
                    {shot.width}×{shot.height}
                  </p>
                </div>

                <div className="grid content-start gap-space-4">
                  <fieldset className="grid gap-space-2">
                    <legend className="mb-space-2 text-label text-ink">{t('device')}</legend>
                    <div className="inline-flex w-fit rounded-md border border-line-strong p-0.5">
                      {screenshotDevices.map((device) => {
                        const Icon = deviceIcons[device]
                        const checked = shot.device === device
                        return (
                          <label
                            key={device}
                            className={cn(
                              'inline-flex h-8 cursor-pointer items-center gap-space-2 rounded-sm px-space-3 text-label transition-colors has-focus-visible:outline-2 has-focus-visible:outline-focus',
                              checked ? 'bg-surface-raised text-ink' : 'text-ink-muted hover:text-ink',
                            )}
                          >
                            <input
                              type="radio"
                              name={`device-${shot.url}`}
                              value={device}
                              checked={checked}
                              onChange={() => setShot(shot.url, { device })}
                              className="sr-only"
                            />
                            <Icon aria-hidden size={16} strokeWidth={1.75} />
                            {t(`devices.${device}`)}
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>
                  <LocalizedField
                    id={`shot-${index}-alt`}
                    label={t('alt')}
                    hint={t('altHint')}
                    value={shot.alt}
                    maxLength={projectLimits.alt}
                    onChange={(alt) => setShot(shot.url, { alt })}
                    errors={localizedError(`screenshots.${index}.alt`)}
                  />
                  <LocalizedField
                    id={`shot-${index}-caption`}
                    label={t('caption')}
                    hint={t('captionHint')}
                    value={shot.caption}
                    maxLength={projectLimits.caption}
                    onChange={(caption) => setShot(shot.url, { caption })}
                    errors={localizedError(`screenshots.${index}.caption`)}
                  />
                  {error(`screenshots.${index}`) && (
                    <p className="flex items-start gap-space-2 text-small text-danger">
                      <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
                      {error(`screenshots.${index}`)}
                    </p>
                  )}
                </div>
              </div>
            </ListRow>
          )}
        />
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'grid justify-items-center gap-space-3 rounded-lg border border-dashed border-line-strong px-space-5 py-space-6 text-center',
          dragOver && 'border-solid border-primary bg-primary-soft',
        )}
      >
        {uploading > 0 ? (
          <p role="status" className="inline-flex items-center gap-space-2 text-label text-ink">
            <LoaderCircle aria-hidden size={18} strokeWidth={1.75} className="animate-spin motion-reduce:animate-none" />
            {t('uploading', { count: uploading })}
          </p>
        ) : (
          <ImageUp aria-hidden size={24} strokeWidth={1.75} className="text-ink-muted" />
        )}
        <p className="max-w-measure text-small text-ink-muted">{room > 0 ? t('drop') : t('full', { max: projectLimits.screenshots })}</p>
        <input
          ref={input}
          type="file"
          multiple
          accept={acceptedImageTypes.join(',')}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => void upload([...(event.target.files ?? [])])}
        />
        <Button variant="secondary" size="sm" disabled={room <= 0} onClick={() => input.current?.click()}>
          {t('add')}
        </Button>
      </div>

      {(uploadErrors.length > 0 || skipped > 0 || listError) && (
        <ul className="grid gap-space-1">
          {listError && <ErrorLine>{listError}</ErrorLine>}
          {skipped > 0 && <ErrorLine>{t('skipped', { count: skipped, max: projectLimits.screenshots })}</ErrorLine>}
          {[...new Set(uploadErrors)].map((key) => (
            <ErrorLine key={key}>{tUpload(`errors.${key}`)}</ErrorLine>
          ))}
        </ul>
      )}
    </div>
  )
}

function ErrorLine({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-space-2 text-small text-danger">
      <CircleAlert aria-hidden size={16} strokeWidth={2} className="mt-0.75 shrink-0" />
      {children}
    </li>
  )
}
