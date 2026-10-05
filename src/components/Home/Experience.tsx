import { differenceInCalendarMonths } from 'date-fns'
import { BriefcaseBusiness, GraduationCap } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { Arrow } from '@/components/ui/Arrow'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'
import type { HomeExperience } from '@/lib/home/types'
import { education, educationStart, getStudyYear } from '@/lib/profile'
import { cn } from '@/utils'

// Ram's path as a vertical timeline, oldest first, ending at today: one node per entry on a line that draws itself as
// the page scrolls. From lg the cards alternate sides of a centre line with the dates opposite them, pinned while a tall
// card scrolls past. Work comes from the console; the university comes from lib/profile. See docs/home.md#experience

type Entry = {
  id: string
  kind: 'work' | 'study'
  role: string
  organization: string
  url?: string
  summary: string
  highlights: string[]
  projectSlug?: string
  start: Date
  /** The first moment after the role: the start of the month after `endedOn`, or now while ongoing. */
  end: Date
  ongoing: boolean
}

const month = (value: string) => {
  const [year, monthNumber] = value.split('-').map(Number)
  return new Date(Date.UTC(year, monthNumber - 1, 1))
}
const nextMonth = (value: string) => {
  const start = month(value)
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1))
}

// One row of the timeline: a node column on the start side under lg, the middle column from lg.
const rowClasses =
  'relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-space-4 lg:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] lg:gap-x-space-7'
// The line runs through the node column's centre.
const lineClasses = 'absolute top-[1.125rem] bottom-1.5 w-0.5 start-[calc(1.125rem-1px)] lg:start-[calc(50%-1px)]'

export function Experience({ experience }: { experience: HomeExperience[] }) {
  const t = useTranslations('Home.experience')
  const tProfile = useTranslations('Profile')
  const tCommon = useTranslations('Common')
  const format = useFormatter()
  // Rendered with the static page, which regenerates daily (docs/home.md#rendering), so "today" is at most a day old.
  const now = new Date()
  const studyYear = getStudyYear(now)
  const monthYear = (date: Date) => format.dateTime(date, { month: 'short', year: 'numeric', timeZone: 'UTC' })

  const study: Entry = {
    id: 'university',
    kind: 'study',
    role: tProfile('education.field'),
    organization: tProfile('education.university'),
    summary: `${tProfile('education.formerly')} · ${
      studyYear === null
        ? tProfile('education.graduated', { date: format.dateTime(education.graduation, { month: 'long', year: 'numeric', timeZone: 'UTC' }) })
        : tProfile('education.studyYear', { year: studyYear })
    }`,
    highlights: [],
    start: educationStart,
    end: studyYear === null ? education.graduation : now,
    ongoing: studyYear !== null,
  }

  const entries: Entry[] = [
    ...experience.map((entry) => ({
      ...entry,
      kind: 'work' as const,
      start: month(entry.startedOn),
      end: entry.endedOn ? nextMonth(entry.endedOn) : now,
      ongoing: !entry.endedOn,
    })),
    ...(educationStart <= now ? [study] : []),
  ].sort((a, b) => a.start.getTime() - b.start.getTime())

  if (entries.length === 0) return null

  const duration = (entry: Entry) => {
    const months = differenceInCalendarMonths(entry.end, entry.start) + (entry.ongoing ? 1 : 0)
    const parts = [
      Math.floor(months / 12) > 0 && t('years', { count: Math.floor(months / 12) }),
      months % 12 > 0 && t('months', { count: months % 12 }),
    ]
    return parts.filter(Boolean).join(' ')
  }

  return (
    <section id="experience" aria-labelledby="experience-title" className="border-t border-line py-space-8 md:py-space-9">
      <Container className="grid gap-space-7 md:gap-space-8">
        <SectionHeading
          id="experience-title"
          index="03"
          eyebrow={t('eyebrow')}
          title={t('title')}
          description={t('description')}
        />

        <ol className="relative grid gap-space-7">
          <span aria-hidden className={cn(lineClasses, 'bg-line')} />
          <span aria-hidden className={cn(lineClasses, 'scroll-draw bg-ink-muted')} />

          {entries.map((entry, index) => {
            const Icon = entry.kind === 'study' ? GraduationCap : BriefcaseBusiness
            // From lg, even entries put the card on the end side and the date on the start side; odd ones swap.
            const cardOnEnd = index % 2 === 0

            return (
              <li key={entry.id} className={cn(rowClasses, 'gap-y-space-3')}>
                <span
                  className={cn(
                    'relative col-start-1 row-span-2 row-start-1 grid size-9 place-items-center self-start rounded-full border lg:col-start-2 lg:row-span-1',
                    entry.ongoing ? 'border-primary-ink bg-primary-soft text-primary-ink' : 'border-line-strong bg-bg text-ink-muted',
                  )}
                >
                  <Icon aria-hidden size={18} strokeWidth={1.75} />
                </span>

                <div
                  className={cn(
                    'col-start-2 row-start-1 grid content-start gap-space-1 lg:sticky lg:top-[calc(var(--nav-height)+var(--space-7))] lg:self-start lg:pt-0.5',
                    cardOnEnd ? 'lg:col-start-1 lg:text-end' : 'lg:col-start-3',
                  )}
                >
                  <p className="font-mono text-h3 text-ink tabular-nums">
                    {monthYear(entry.start)} – {entry.ongoing ? t('present') : monthYear(new Date(entry.end.getTime() - 1))}
                  </p>
                  <p className="text-small text-ink-muted">
                    {entry.kind === 'study' ? t('study') : t('work')} ·{' '}
                    <span className="font-mono tabular-nums">{duration(entry)}</span>
                  </p>
                </div>

                <article
                  className={cn(
                    'col-start-2 row-start-2 grid content-start gap-space-4 rounded-lg border border-line bg-surface p-space-5 md:p-space-6 lg:row-start-1',
                    cardOnEnd ? 'lg:col-start-3' : 'lg:col-start-1',
                  )}
                >
                  <header className="grid gap-space-1">
                    <h3 className="text-h3 text-ink">{entry.role}</h3>
                    {/* bdi keeps a Latin name in its own direction without pulling the line to the other side. */}
                    <p className="text-label text-primary-ink">
                      <bdi>{entry.organization}</bdi>
                    </p>
                  </header>

                  <p className="text-body text-ink-muted">{entry.summary}</p>

                  {entry.highlights.length > 0 && (
                    <ul className="grid gap-space-2 border-t border-line pt-space-4 text-small text-ink">
                      {entry.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="grid grid-cols-[auto_minmax(0,1fr)] gap-space-3">
                          <span aria-hidden className="mt-2.25 size-1 rounded-full bg-ink-muted" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}

                  {(entry.url || entry.projectSlug) && (
                    <p className="flex flex-wrap gap-x-space-5 gap-y-space-2">
                      {entry.projectSlug && (
                        <Link
                          href={`/portfolio/${entry.projectSlug}`}
                          className="group inline-flex items-center gap-space-1 text-label text-primary-ink"
                        >
                          {t('caseStudy')}
                          <Arrow />
                        </Link>
                      )}
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group inline-flex items-center gap-space-1 font-mono text-code text-ink-muted transition-colors hover:text-ink"
                        >
                          {entry.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                          <span className="sr-only">{tCommon('newTab')}</span>
                          <Arrow direction="external" />
                        </a>
                      )}
                    </p>
                  )}
                </article>
              </li>
            )
          })}

          {/* The line ends at today. */}
          <li className={cn(rowClasses, 'items-center')}>
            <span className="col-start-1 grid place-items-center lg:col-start-2">
              <span className="size-3 rounded-full border-2 border-ink bg-bg" />
            </span>
            <p className="col-start-2 font-mono text-code text-ink-muted lg:col-start-3">
              {t('today')} · {monthYear(now)}
            </p>
          </li>
        </ol>
      </Container>
    </section>
  )
}
