import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { siteUrl } from './site'

/** The absolute URL of a site path in one locale, e.g. ('/portfolio', 'ar') → https://ramfarid.com/ar/portfolio. */
export function absoluteUrl(href: string, locale: Locale) {
  return `${siteUrl}${getPathname({ href, locale })}`
}

type PageMetadataInput = {
  locale: Locale
  /** The path without its locale prefix, e.g. '/portfolio'. */
  href: string
  title: string
  description: string
  image?: { url: string; width: number; height: number; alt: string }
}

// One page's title, description, canonical URL, language alternates and Open Graph card. See docs/seo.md#rules-for-every-public-page
export function pageMetadata({ locale, href, title, description, image }: PageMetadataInput): Metadata {
  const url = absoluteUrl(href, locale)

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(routing.locales.map((code) => [code, absoluteUrl(href, code)])),
        'x-default': absoluteUrl(href, routing.defaultLocale),
      },
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      locale,
      siteName: 'Ram Farid',
      images: image ? [image] : undefined,
    },
  }
}
