'use client'

import { useLocale, useTranslations } from 'next-intl'
import { buttonClasses } from '@/components/ui/Button'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/utils'

// The language switch: a square secondary button showing the other language's mark ("ع" or "EN"), named in full for
// assistive tech, so the nav has room for six section links. See docs/home.md#structure-work-first-in-project-bands
export function LocaleSwitch() {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const pathname = usePathname()
  const other = locale === 'en' ? 'ar' : 'en'

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      lang={other}
      aria-label={t('switchLocale')}
      title={t('switchLocale')}
      className={cn(buttonClasses({ variant: 'secondary', size: 'sm' }), 'w-9 px-0', other === 'en' && 'font-mono text-code')}
    >
      {t('switchLocaleShort')}
    </Link>
  )
}
