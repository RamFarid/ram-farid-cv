import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { fontVariables } from '@/fonts'
import { localeDirection, routing } from '@/i18n/routing'
import { siteUrl } from '@/lib/seo/site'
import '../globals.css'

// The root layout lives under [locale] so <html lang dir> come from the URL (next-intl with i18n routing).
export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return (
    <html lang={locale} dir={localeDirection[locale]} className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata')

  return {
    // Resolves relative Open Graph image URLs into absolute ones.
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
  }
}
