'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { SortableList } from '@/components/Console/SortableList'
import { TextField } from '@/components/ui/TextField'
import { cvLimits, cvPageSizes } from '@/lib/validations/cv'
import { cn } from '@/utils'
import { CvGroup, toggleIn, type CvFieldsProps } from './parts'

// The CV's section order and visibility, its certificates, the paper size, and the one-time file's company name (kept
// in the page only, never saved). See docs/cv.md#setup

type LayoutFieldsProps = CvFieldsProps & {
  company: string
  onCompanyChange: (company: string) => void
  companyHint: ReactNode
}

export function LayoutFields({ config, change, sources, company, onCompanyChange, companyHint }: LayoutFieldsProps) {
  const t = useTranslations('Console.cv')

  return (
    <CvGroup id="layout" title={t('groups.layout.title')} description={t('groups.layout.description')}>
      <div className="grid gap-space-7 lg:grid-cols-2 lg:items-start">
        <div className="grid content-start gap-space-3">
          <p id="cv-sections-label" className="text-label text-ink">
            {t('sections')}
          </p>
          <SortableList
            items={config.sections}
            getId={(section) => section.id}
            getLabel={(section) => t(`sectionNames.${section.id}`)}
            onReorder={(sections) => change((current) => ({ ...current, sections }))}
            className="rounded-lg border border-line"
            renderItem={(section, index, handle) => (
              <div className="flex min-h-12 items-center gap-space-2 border-b border-line px-space-2 in-[li:last-child]:border-b-0">
                {handle}
                <span className="w-6 font-mono text-code text-ink-muted tabular-nums" dir="ltr">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <label className="flex flex-1 cursor-pointer items-center justify-between gap-space-3 py-space-2 pe-space-2">
                  <span className={cn('text-body', section.visible ? 'text-ink' : 'text-ink-muted line-through')}>
                    {t(`sectionNames.${section.id}`)}
                  </span>
                  <span className="flex items-center gap-space-2 text-small text-ink-muted">
                    {t('show')}
                    <input
                      type="checkbox"
                      checked={section.visible}
                      onChange={(event) =>
                        change((current) => ({
                          ...current,
                          sections: current.sections.map((item) =>
                            item.id === section.id ? { ...item, visible: event.target.checked } : item,
                          ),
                        }))
                      }
                      className="size-4 accent-primary"
                    />
                  </span>
                </label>
              </div>
            )}
          />
          <p className="text-small text-ink-muted">{t('sectionsHint')}</p>
        </div>

        <div className="grid content-start gap-space-7">
          <fieldset className="grid gap-space-2">
            <legend className="mb-space-2 text-label text-ink">{t('certifications')}</legend>
            {sources.certifications.length === 0 ? (
              <p className="text-small text-ink-muted">{t('certificationsEmpty')}</p>
            ) : (
              sources.certifications.map((cert) => (
                <label key={cert.id} className="flex cursor-pointer items-start gap-space-3 text-small text-ink">
                  <input
                    type="checkbox"
                    checked={config.certifications.includes(cert.id)}
                    onChange={() => change((current) => ({ ...current, certifications: toggleIn(current.certifications, cert.id) }))}
                    className="mt-0.75 size-4 shrink-0 accent-primary"
                  />
                  <span dir="ltr">
                    {cert.name} <span className="text-ink-muted">| {cert.issuer}</span>
                  </span>
                </label>
              ))
            )}
          </fieldset>

          <fieldset className="grid gap-space-2">
            <legend className="mb-space-2 text-label text-ink">{t('pageSize')}</legend>
            <div className="flex flex-wrap gap-space-2">
              {cvPageSizes.map((size) => (
                <label
                  key={size}
                  className="flex h-10 cursor-pointer items-center gap-space-2 rounded-md border border-line px-space-4 text-small text-ink transition-colors hover:border-line-strong has-checked:border-primary has-checked:bg-primary-soft has-checked:text-primary-ink"
                >
                  <input
                    type="radio"
                    name="cv-page-size"
                    value={size}
                    checked={config.pageSize === size}
                    onChange={() => change((current) => ({ ...current, pageSize: size }))}
                    className="size-4 accent-primary"
                  />
                  {t(`pageSizes.${size}`)}
                </label>
              ))}
            </div>
            <p className="text-small text-ink-muted">{t('pageSizeHint')}</p>
          </fieldset>

          <TextField
            label={t('company')}
            name="cv-company"
            placeholder={t('companyPlaceholder')}
            hint={companyHint}
            value={company}
            maxLength={cvLimits.company}
            onChange={(event) => onCompanyChange(event.target.value)}
            dir="auto"
          />
        </div>
      </div>
    </CvGroup>
  )
}
