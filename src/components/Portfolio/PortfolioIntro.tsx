import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'

// The index's compact head band: short enough that the violet rail and the first frame's caption fit the first view.
export function PortfolioHead({ children }: { children: ReactNode }) {
  return (
    <section
      aria-labelledby="portfolio-title"
      className="pt-[calc(var(--nav-height)+var(--space-4)+var(--space-7))] pb-space-6"
    >
      <Container className="grid gap-space-5 lg:grid-cols-12 lg:items-end lg:gap-space-6">{children}</Container>
    </section>
  )
}

export function PortfolioIntro() {
  const t = useTranslations('Portfolio')

  return (
    <div className="grid gap-space-4">
      <h1 id="portfolio-title" className="text-h1 text-balance text-ink md:text-display">
        {t('title')}
      </h1>
      <p className="max-w-measure text-body-lg text-pretty text-ink-muted">{t('lead')}</p>
    </div>
  )
}

export function ProjectCount({ count }: { count: number }) {
  const t = useTranslations('Portfolio')

  return (
    <p className="text-small text-ink-muted">
      {t.rich('count', {
        count,
        n: (chunks) => <span className="font-mono text-code text-ink tabular-nums">{chunks}</span>,
      })}
    </p>
  )
}
