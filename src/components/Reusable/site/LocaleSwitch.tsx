'use client'

import { useLocale, useTranslations } from 'next-intl'
import { buttonClasses } from '@/components/ui/Button'
import { Link, usePathname } from '@/i18n/navigation'

// The language switch is a secondary button labelled in the other language (design-system README: Arabic & RTL).
export function LocaleSwitch() {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const pathname = usePathname()
  const other = locale === 'en' ? 'ar' : 'en'

  return (
    <Link href={pathname} locale={other} hrefLang={other} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
      <span lang={other}>{t('switchLocale')}</span>
    </Link>
  )
}
