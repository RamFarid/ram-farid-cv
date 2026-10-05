'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { EmptyList } from '@/components/Console/ListParts'
import { Link } from '@/i18n/navigation'
import { cvExperienceTiers, type CvConfigInput } from '@/lib/validations/cv'
import { cn } from '@/utils'
import { CvGroup, toggleIn, type CvFieldsProps } from './parts'

// The home page's roles, newest first as the CV lists them, each placed under Professional or Additional Experience
// or left off, with the highlights to keep. The roles themselves are edited on the home page. See docs/cv.md#setup

type Setup = CvConfigInput['experience'][number]

const month = (value: string) => {
  const [year, monthNumber] = value.split('-').map(Number)
  return new Date(Date.UTC(year, monthNumber - 1, 1))
}

export function ExperienceFields({ config, change, sources }: CvFieldsProps) {
  const t = useTranslations('Console.cv')
  const format = useFormatter()
  const monthYear = (value: string) => format.dateTime(month(value), { month: 'short', year: 'numeric', timeZone: 'UTC' })

  const setRole = (id: string, next: (setup: Setup) => Setup) =>
    change((current) => ({
      ...current,
      experience: current.experience.map((setup) => (setup.id === id ? next(setup) : setup)),
    }))

  return (
    <CvGroup id="experience" title={t('groups.experience.title')} description={t('groups.experience.description')}>
      {sources.experience.length === 0 ? (
        <EmptyList>{t('experienceEmpty')}</EmptyList>
      ) : (
        <ul className="grid border-t border-line">
          {sources.experience.map((role) => {
            const setup = config.experience.find((entry) => entry.id === role.id) ?? { id: role.id, tier: 'main', hiddenHighlights: [] }
            const hidden = setup.tier === 'hidden'
            return (
              <li key={role.id} className="grid gap-space-4 border-b border-line py-space-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-space-6">
                <div className={cn('grid content-start gap-space-1', hidden && 'opacity-60')}>
                  <p className="text-label text-ink" dir="ltr">
                    {role.role} <span className="text-ink-muted">|</span> <bdi className="text-primary-ink">{role.organization}</bdi>
                  </p>
                  <p className="font-mono text-code text-ink-muted tabular-nums" dir="ltr">
                    {monthYear(role.startedOn)} – {role.endedOn ? monthYear(role.endedOn) : t('present')}
                  </p>
                  <p className="text-small text-ink-muted" dir="ltr">
                    {role.summary}
                  </p>
                </div>

                <fieldset className="lg:row-span-2">
                  <legend className="sr-only">{t('tier', { role: role.organization })}</legend>
                  <div className="inline-flex rounded-md border border-line-strong p-0.5">
                    {cvExperienceTiers.map((tier) => (
                      <label
                        key={tier}
                        className="flex h-8 cursor-pointer items-center rounded-sm px-space-3 text-small text-ink-muted transition-colors hover:text-ink has-checked:bg-primary-soft has-checked:text-primary-ink has-focus-visible:outline-2 has-focus-visible:outline-focus"
                      >
                        <input
                          type="radio"
                          name={`cv-tier-${role.id}`}
                          value={tier}
                          checked={setup.tier === tier}
                          onChange={() => setRole(role.id, (current) => ({ ...current, tier }))}
                          className="sr-only"
                        />
                        {t(`tiers.${tier}`)}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {!hidden && (
                  <fieldset className="grid gap-space-2">
                    <legend className="mb-space-2 text-small text-ink-muted">{t('highlights')}</legend>
                    {role.highlights.length === 0 && <p className="text-small text-ink-muted">{t('noHighlights')}</p>}
                    {role.highlights.map((highlight) => (
                      <label key={highlight.id} className="flex cursor-pointer items-start gap-space-3 text-small text-ink">
                        <input
                          type="checkbox"
                          checked={!setup.hiddenHighlights.includes(highlight.id)}
                          onChange={() =>
                            setRole(role.id, (current) => ({
                              ...current,
                              hiddenHighlights: toggleIn(current.hiddenHighlights, highlight.id),
                            }))
                          }
                          className="mt-0.75 size-4 shrink-0 accent-primary"
                        />
                        <span dir="ltr">
                          {highlight.text}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-small text-ink-muted">
        {t.rich('editRoles', {
          link: (chunks) => (
            <Link href="/console#experience" className="text-primary-ink underline-offset-4 hover:underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </CvGroup>
  )
}
