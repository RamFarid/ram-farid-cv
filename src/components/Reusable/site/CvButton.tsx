import { Download } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Button, ButtonLink } from '@/components/ui/Button'
import { getCvUrl } from '@/lib/profile'

type CvButtonProps = {
  size?: 'md' | 'sm'
  className?: string
}

// Download CV, always the secondary action. Disabled until a CV is uploaded in the console (docs/console.md#cv).
export async function CvButton({ size, className }: CvButtonProps) {
  const [t, url] = await Promise.all([getTranslations('Nav'), getCvUrl()])
  const icon = <Download aria-hidden size={18} strokeWidth={1.75} />

  if (!url) {
    return (
      <Button variant="secondary" size={size} icon={icon} disabled className={className}>
        {t('cv')}
      </Button>
    )
  }

  return (
    <ButtonLink href={url} variant="secondary" size={size} icon={icon} className={className}>
      {t('cv')}
    </ButtonLink>
  )
}
