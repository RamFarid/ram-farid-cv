import { Download } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/utils'

type CvButtonProps = {
  size?: 'md' | 'sm'
  className?: string
}

// Download CV, always the secondary action. The CV is generated from the site's content at /api/cv (docs/cv.md), an
// API route outside the locale segment, so it's a plain link rather than the locale-aware one.
export async function CvButton({ size, className }: CvButtonProps) {
  const t = await getTranslations('Nav')

  return (
    <a href="/api/cv" download className={cn(buttonClasses({ variant: 'secondary', size }), className)}>
      <Download aria-hidden size={18} strokeWidth={1.75} />
      {t('cv')}
    </a>
  )
}
