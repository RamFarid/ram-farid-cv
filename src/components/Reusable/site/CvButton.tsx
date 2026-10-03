import { Download } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button, ButtonLink } from '@/components/ui/Button'
import { getCvUrl } from '@/lib/profile'

type CvButtonProps = {
  size?: 'md' | 'sm'
  className?: string
}

// Download CV, always the secondary action. Disabled until CV_URL is set (the R2 file, later managed from the console).
export function CvButton({ size, className }: CvButtonProps) {
  const t = useTranslations('Nav')
  const url = getCvUrl()
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
