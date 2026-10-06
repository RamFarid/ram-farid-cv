import { useFormatter, useTranslations } from 'next-intl'
import { CvButton } from '@/components/Reusable/site/CvButton'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { WorkType } from '@/lib/validations/profile'

// The slim intro strip: short enough that the violet Work field starts above the fold. See docs/home.md
// `availability` comes from the console (docs/console.md#availability); empty hides the badge.
export function Intro({ availability }: { availability: WorkType[] }) {
  const t = useTranslations('Home.intro')
  const tAvailability = useTranslations('Profile.availability')
  const format = useFormatter()

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
            {availability.length > 0 && (
              <StatusBadge tone="success">
                {tAvailability('badge', {
                  types: format.list(
                    availability.map((type) => tAvailability(`types.${type}`)),
                    { type: 'conjunction' },
                  ),
                })}
              </StatusBadge>
            )}
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
