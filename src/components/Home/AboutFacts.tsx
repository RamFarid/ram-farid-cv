import type { ReactNode } from 'react'
import { useFormatter, useTranslations } from 'next-intl'
import { education, getStudyYear, spokenLanguages } from '@/lib/profile'

// Location, education and languages under the About figures, as ruled rows. The study year is computed from the date, so
// it moves up each 21 July without an edit. See docs/home.md#location-education-and-languages

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-space-1 border-b border-line py-space-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-space-5">
      <dt className="text-label text-ink-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function AboutFacts() {
  const t = useTranslations('Profile')
  const format = useFormatter()
  const year = getStudyYear()
  const graduation = format.dateTime(education.graduation, { month: 'long', year: 'numeric', timeZone: 'UTC' })

  return (
    <dl className="grid border-t border-line">
      <Fact label={t('location.label')}>
        <p className="text-body text-ink">{t('location.place')}</p>
      </Fact>

      <Fact label={t('education.label')}>
        <p className="text-body text-ink">
          {t('education.field')} · {t('education.university')}
        </p>
        <p className="mt-space-1 text-small text-ink-muted">
          {t('education.formerly')} ·{' '}
          {year === null ? t('education.graduated', { date: graduation }) : t('education.year', { year, date: graduation })}
        </p>
      </Fact>

      <Fact label={t('languages.label')}>
        <ul className="flex flex-wrap gap-x-space-5 gap-y-space-1">
          {spokenLanguages.map((language) => (
            <li key={language.id} className="text-body text-ink">
              {t(`languages.${language.id}`)}{' '}
              <span className="text-small text-ink-muted">· {t(`languages.levels.${language.level}`)}</span>
            </li>
          ))}
        </ul>
      </Fact>
    </dl>
  )
}
