'use client'

import { useState, useTransition, type ReactNode } from 'react'
import { Download, LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useFieldErrors } from '@/components/Console/fieldErrors'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/ui/TagInput'
import { TextArea, TextField } from '@/components/ui/TextField'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { downloadOneTimeCv, saveCv } from '@/lib/cv/actions'
import type { CvSources } from '@/lib/cv/types'
import {
  cvConfigZSchema,
  cvContactIds,
  cvFileName,
  cvLimits,
  CV_YEARS_PLACEHOLDER,
  type CvConfigInput,
  type CvContactId,
} from '@/lib/validations/cv'
import { ExperienceFields } from './ExperienceFields'
import { LayoutFields } from './LayoutFields'
import { CvGroup, toggleIn, ToggleChip } from './parts'
import { ProjectsFields } from './ProjectsFields'
import { SkillsFields } from './SkillsFields'

// /console/cv: the setup behind the generated CV, as one draft. Save makes it the public CV at /api/cv; Download
// one-time builds a PDF from the draft as it stands, for one application, and stores nothing. See docs/cv.md#console

type CvEditorProps = {
  initial: CvConfigInput
  sources: CvSources
  /** Each contact as the CV writes it. */
  contacts: Record<CvContactId, string>
  /** What `{years}` reads today. */
  years: number
}

/** Isolates a value inside translated copy, so it keeps its order in Arabic. */
const mono = (chunks: ReactNode) => (
  <bdi dir="ltr" className="font-mono text-code">
    {chunks}
  </bdi>
)

export function CvEditor({ initial, sources, contacts, years }: CvEditorProps) {
  const t = useTranslations('Console.cv')
  const tSave = useTranslations('Console.save')
  const { draft, update, errors, dirty, pending, save, discard, validate } = useSectionDraft('cv', initial, cvConfigZSchema, saveCv)
  const fieldError = useFieldErrors(errors)
  const [company, setCompany] = useState('')
  const [building, startBuilding] = useTransition()
  const busy = pending || building
  const change = (next: (config: CvConfigInput) => CvConfigInput) => update(next)
  const props = { config: draft, change, fieldError, sources }

  const downloadOneTime = () => {
    if (!validate()) {
      toast.error(t('oneTimeInvalid'))
      return
    }
    startBuilding(async () => {
      try {
        const result = await downloadOneTimeCv({ config: draft, company })
        if (!result.ok) {
          toast.error(result.error === 'invalid' ? t('oneTimeInvalid') : tSave(result.error))
          return
        }
        const url = URL.createObjectURL(new Blob([new Uint8Array(result.pdf)], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = url
        link.download = result.fileName
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 10_000)
        toast.success(t('oneTimeReady', { file: result.fileName, pages: result.pages }))
      } catch {
        toast.error(tSave('unavailable'))
      }
    })
  }

  return (
    <div className="mx-auto max-w-page">
      <header className="sticky top-0 z-30 -mx-space-4 flex flex-wrap items-center gap-x-space-4 gap-y-space-3 border-b border-line bg-bg px-space-4 py-space-4 md:-mx-space-6 md:px-space-6 lg:-mx-space-7 lg:px-space-7">
        <h1 className="min-w-0 flex-1 basis-40 truncate text-h3 text-ink">{t('title')}</h1>

        <div className="flex flex-wrap items-center gap-space-2">
          <p aria-live="polite" className="text-small text-ink-muted">
            {busy ? (
              <span className="inline-flex items-center gap-space-2">
                <LoaderCircle aria-hidden size={16} strokeWidth={1.75} className="animate-spin motion-reduce:animate-none" />
                {building ? t('building') : tSave('saving')}
              </span>
            ) : dirty ? (
              <span className="inline-flex items-center gap-space-2 text-warning">
                <span aria-hidden className="size-1.5 rounded-full bg-warning" />
                {tSave('unsaved')}
              </span>
            ) : null}
          </p>
          <Button variant="quiet" size="sm" disabled={!dirty || busy} onClick={discard}>
            {tSave('discard')}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download aria-hidden size={16} strokeWidth={1.75} />}
            disabled={busy}
            onClick={downloadOneTime}
          >
            {t('oneTime')}
          </Button>
          <Button variant={dirty ? 'primary' : 'secondary'} size="sm" disabled={!dirty || busy} onClick={() => save({ success: t('saved') })}>
            {tSave('save')}
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-space-4 pt-space-7 pb-space-2">
        <p className="max-w-measure text-body text-ink-muted">{t('lead')}</p>
        <a
          href="/api/cv"
          download
          className="inline-flex items-center gap-space-2 text-label text-primary-ink underline-offset-4 hover:underline"
        >
          <Download aria-hidden size={16} strokeWidth={1.75} />
          {t('publicCv')}
        </a>
      </div>

      <CvGroup id="header" title={t('groups.header.title')} description={t('groups.header.description')}>
        <div className="grid gap-space-5 lg:grid-cols-2 lg:items-start">
          <TextField
            label={t('headline')}
            name="cv-headline"
            hint={t('headlineHint')}
            value={draft.headline}
            maxLength={cvLimits.headline}
            onChange={(event) => change((config) => ({ ...config, headline: event.target.value }))}
            error={fieldError.one('headline')}
            dir="ltr"
          />
          <TagInput
            id="cv-tools"
            label={t('tools')}
            value={draft.tools}
            max={cvLimits.tools}
            maxLength={cvLimits.tool}
            placeholder={t('toolsPlaceholder')}
            hint={t('toolsHint')}
            onChange={(tools) => change((config) => ({ ...config, tools }))}
            error={fieldError.one('tools')}
          />
        </div>

        <fieldset className="grid gap-space-3">
          <legend className="mb-space-2 text-label text-ink">{t('contacts')}</legend>
          <div className="flex flex-wrap gap-space-2">
            {cvContactIds.map((id) => (
              <ToggleChip
                key={id}
                pressed={draft.contacts.includes(id)}
                onToggle={() => change((config) => ({ ...config, contacts: toggleIn(config.contacts, id) }))}
              >
                <span className="text-ink-muted">{t(`contactNames.${id}`)}</span>
                <bdi dir="ltr" className="ms-space-2 font-mono text-code">
                  {contacts[id]}
                </bdi>
              </ToggleChip>
            ))}
          </div>
          <p className="text-small text-ink-muted">{t('contactsHint')}</p>
        </fieldset>
      </CvGroup>

      <CvGroup id="summary" title={t('groups.summary.title')} description={t('groups.summary.description')}>
        <div className="grid max-w-measure gap-space-2">
          <TextArea
            label={t('summary')}
            name="cv-summary"
            rows={8}
            value={draft.summary}
            maxLength={cvLimits.summary}
            hint={t.rich('summaryHint', { placeholder: CV_YEARS_PLACEHOLDER, years, code: mono })}
            onChange={(event) => change((config) => ({ ...config, summary: event.target.value }))}
            error={fieldError.one('summary')}
            dir="ltr"
          />
          <p className="justify-self-end font-mono text-code text-ink-muted tabular-nums" dir="ltr">
            {draft.summary.length} / {cvLimits.summary}
          </p>
        </div>
      </CvGroup>

      <ExperienceFields {...props} />
      <ProjectsFields {...props} />
      <SkillsFields {...props} />
      <LayoutFields
        {...props}
        company={company}
        onCompanyChange={setCompany}
        companyHint={t.rich('companyHint', { file: cvFileName(company || t('companyPlaceholder')), code: mono })}
      />
    </div>
  )
}
