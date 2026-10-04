import Image from 'next/image'
import { useFormatter, useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCard } from '@/components/ui/StatCard'
import type { HomeAbout } from '@/lib/home/types'
import { careerStart, getYearsOfExperience } from '@/lib/profile'
import { CLIENTS_PLACEHOLDER } from '@/lib/validations/home'

// Opens with a plain first-person answer (docs/seo.md: answer-ready copy). The copy and the client count are edited in
// the console; years and live projects are computed, never typed. See docs/console.md#about
export function About({ about, projectCount }: { about: HomeAbout; projectCount: number }) {
  const t = useTranslations('Home.about')
  const format = useFormatter()
  const since = format.dateTime(careerStart, { month: 'long', year: 'numeric', timeZone: 'UTC' })
  const clients = format.number(about.clientCount)

  return (
    <section id="about" aria-labelledby="about-title" className="py-space-8 md:py-space-9">
      <Container className="grid gap-space-7 lg:grid-cols-12">
        <div className="relative grid aspect-[4/5] w-full max-w-40 place-items-center overflow-hidden rounded-lg border border-line bg-surface-raised lg:col-span-4 lg:max-w-none">
          {about.portrait ? (
            <Image
              src={about.portrait.url}
              alt={t('portraitAlt')}
              fill
              sizes="(min-width: 1200px) 370px, (min-width: 1024px) 30vw, 160px"
              className="object-cover"
            />
          ) : (
            // Until the portrait is uploaded the frame shows a monogram, never a stock photo.
            <span aria-hidden className="font-mono text-display text-line-strong">
              RF
            </span>
          )}
        </div>

        <div className="grid content-start gap-space-6 lg:col-span-8">
          <SectionHeading id="about-title" index="02" eyebrow={t('eyebrow')} title={about.title} />

          <div className="grid max-w-measure gap-space-4 text-body-lg text-ink-muted">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.replaceAll(CLIENTS_PLACEHOLDER, clients)}</p>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
            <StatCard
              className="rounded-none border-0"
              value={format.number(getYearsOfExperience(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              label={t('years')}
              note={<span className="max-sm:hidden">{t('since', { since })}</span>}
            />
            <StatCard className="rounded-none border-0" value={clients} label={t('clients')} />
            <StatCard className="rounded-none border-0" value={format.number(projectCount)} label={t('projects')} />
          </div>
        </div>
      </Container>
    </section>
  )
}
