'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { ImageUpload } from '@/components/Console/ImageUpload'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { TextField } from '@/components/ui/TextField'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { saveAbout } from '@/lib/home/actions'
import { aboutZSchema, CLIENTS_PLACEHOLDER, homeLimits, type AboutInput } from '@/lib/validations/home'
import { useFieldErrors } from '@/components/Console/fieldErrors'

type AboutSectionProps = {
  initial: AboutInput
  /** Computed, read-only here: published projects and years since the career start. */
  projectCount: number
  years: number
  since: string
}

export function AboutSection({ initial, projectCount, years, since }: AboutSectionProps) {
  const t = useTranslations('Console.about')
  const format = useFormatter()
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft('about', initial, aboutZSchema, saveAbout)
  const fieldError = useFieldErrors(errors)

  return (
    <SectionPanel
      id="about"
      index="02"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={() => save()}
      onDiscard={discard}
    >
      <div className="grid gap-space-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="grid content-start gap-space-5">
          <LocalizedField
            id="about-heading"
            label={t('heading')}
            value={draft.title}
            maxLength={homeLimits.aboutTitle}
            onChange={(title) => update((current) => ({ ...current, title }))}
            errors={fieldError.localized('title')}
          />
          <LocalizedField
            id="about-body"
            label={t('body')}
            multiline
            rows={7}
            value={draft.body}
            maxLength={homeLimits.aboutBody}
            onChange={(body) => update((current) => ({ ...current, body }))}
            errors={fieldError.localized('body')}
            hint={t.rich('bodyHint', {
              token: () => <code className="font-mono text-code text-ink">{CLIENTS_PLACEHOLDER}</code>,
            })}
            snippets={[{ label: t('insertClients'), text: CLIENTS_PLACEHOLDER }]}
          />

          {/* The client count is typed; the other two figures are computed and only shown here. */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            <div className="bg-surface p-space-4">
              <TextField
                label={t('clients')}
                name="about-clients"
                type="number"
                inputMode="numeric"
                dir="ltr"
                min={0}
                max={homeLimits.clientCount}
                value={Number.isNaN(draft.clientCount) ? '' : draft.clientCount}
                onChange={(event) => update((current) => ({ ...current, clientCount: event.target.valueAsNumber }))}
                error={fieldError.one('clientCount')}
              />
            </div>
            <div className="grid content-start gap-space-2 bg-surface p-space-4">
              <p className="text-label text-ink">{t('projects')}</p>
              <p className="font-mono text-numeral text-ink tabular-nums">{format.number(projectCount)}</p>
              <p className="text-small text-ink-muted">{t('projectsNote')}</p>
            </div>
            <div className="grid content-start gap-space-2 bg-surface p-space-4">
              <p className="text-label text-ink">{t('years')}</p>
              <p className="font-mono text-numeral text-ink tabular-nums">
                {format.number(years, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </p>
              <p className="text-small text-ink-muted">{t('yearsNote', { since })}</p>
            </div>
          </div>
        </div>

        <ImageUpload
          label={t('portrait')}
          folder="home/portrait"
          aspect="portrait"
          value={draft.portrait}
          onChange={(portrait) => update((current) => ({ ...current, portrait }))}
          error={fieldError.one('portrait')}
          className="max-w-56 lg:max-w-none"
        />
      </div>
    </SectionPanel>
  )
}
