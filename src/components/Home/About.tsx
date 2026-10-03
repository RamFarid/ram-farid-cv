import { useFormatter, useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCard } from '@/components/ui/StatCard'
import { careerStart, clientCount, getYearsOfExperience } from '@/lib/profile'

// Opens with a plain first-person answer (docs/seo.md: answer-ready copy). Every figure is computed, never typed.
export function About({ projectCount }: { projectCount: number }) {
  const t = useTranslations('Home.about')
  const format = useFormatter()
  const since = format.dateTime(careerStart, { month: 'long', year: 'numeric', timeZone: 'UTC' })

  return (
    <section id="about" aria-labelledby="about-title" className="py-space-8 md:py-space-9">
      <Container className="grid gap-space-7 lg:grid-cols-12">
        {/* TODO(Ram): the portrait. Until it exists the frame shows a monogram, never a stock photo. */}
        <div
          aria-hidden
          className="grid aspect-[4/5] w-full max-w-40 place-items-center rounded-lg border border-line bg-surface-raised lg:col-span-4 lg:max-w-none"
        >
          <span className="font-mono text-display text-line-strong">RF</span>
        </div>

        <div className="grid content-start gap-space-6 lg:col-span-8">
          <SectionHeading id="about-title" index="02" eyebrow={t('eyebrow')} title={t('title')} />

          <div className="grid max-w-measure gap-space-4 text-body-lg text-ink-muted">
            <p>{t('body1', { since, clients: clientCount })}</p>
            <p>{t('body2')}</p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line grid-cols-3">
            <StatCard
              className="rounded-none border-0"
              value={format.number(getYearsOfExperience(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              label={t('years')}
              note={<span className="max-sm:hidden">{t('since', { since })}</span>}
            />
            <StatCard className="rounded-none border-0" value={format.number(clientCount)} label={t('clients')} />
            <StatCard className="rounded-none border-0" value={format.number(projectCount)} label={t('projects')} />
          </div>
        </div>
      </Container>
    </section>
  )
}
