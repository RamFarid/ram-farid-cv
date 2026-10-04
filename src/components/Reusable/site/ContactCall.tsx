import { useTranslations } from 'next-intl'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/utils'

type ContactCallProps = {
  /** Put on the heading, for the parent section's aria-labelledby. */
  headingId: string
  /** `one` closes a single case study ("a project like this one"). */
  about?: 'many' | 'one'
  className?: string
}

// The close of pages other than home: one line and the way to the contact form, the site's primary action.
export function ContactCall({ headingId, about = 'many', className }: ContactCallProps) {
  const t = useTranslations('ContactCall')

  return (
    <div className={cn('grid content-start justify-items-start gap-space-4', className)}>
      <h2 id={headingId} className="text-h2 text-balance text-ink">
        {about === 'one' ? t('titleOne') : t('title')}
      </h2>
      <p className="max-w-measure text-body-lg text-ink-muted">{t('description')}</p>
      <ButtonLink href="/#contact" arrow className="mt-space-2">
        {t('start')}
      </ButtonLink>
    </div>
  )
}
