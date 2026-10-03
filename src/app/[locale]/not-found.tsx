import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-space-4 px-space-4 text-center">
      <p className="font-mono text-numeral text-primary-ink">404</p>
      <h1 className="text-h2">{t('title')}</h1>
      <p className="text-ink-muted">{t('description')}</p>
      <Link href="/" className="text-label text-link hover:underline">
        {t('home')}
      </Link>
    </main>
  )
}
