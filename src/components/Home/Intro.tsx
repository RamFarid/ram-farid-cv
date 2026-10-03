import { useTranslations } from 'next-intl'
import { CvButton } from '@/components/Reusable/site/CvButton'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { isAvailableForWork } from '@/lib/profile'

// The slim intro strip: short enough that the violet Work field starts above the fold. See docs/home.md
export function Intro() {
  const t = useTranslations('Home.intro')

  return (
    <section
      aria-labelledby="intro-title"
      className="dot-grid pt-[calc(var(--nav-height)+var(--space-4)+var(--space-8))] pb-space-8 md:pb-space-9"
    >
      <Container className="grid gap-space-6">
        <h1 id="intro-title" className="max-w-[16ch] text-h1 text-balance text-ink md:text-display">
          {t.rich('title', { hl: (chunks) => <span className="text-primary-ink">{chunks}</span> })}
        </h1>

        <div className="grid gap-space-6 lg:grid-cols-12 lg:items-end">
          <p className="max-w-measure text-body-lg text-ink-muted lg:col-span-7">{t('lead')}</p>

          <div className="flex flex-col items-start gap-space-4 lg:col-span-5 lg:items-end">
            {isAvailableForWork && <StatusBadge tone="success">{t('available')}</StatusBadge>}
            <div className="flex flex-wrap gap-space-3">
              <ButtonLink href="#contact" arrow>
                {t('start')}
              </ButtonLink>
              <CvButton />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
