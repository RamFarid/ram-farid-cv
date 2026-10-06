import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { getPathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { siteUrl } from './site'

/** The absolute URL of a site path in one locale, e.g. ('/portfolio', 'ar') → https://ramfarid.com/ar/portfolio. */
export function absoluteUrl(href: string, locale: Locale) {
  return `${siteUrl}${getPathname({ href, locale })}`
}

/** A path's URL in every locale plus `x-default` (the English page), for hreflang in the HTML and the sitemap. */
export function languageAlternates(href: string) {
  return {
    ...Object.fromEntries(routing.locales.map((code) => [code, absoluteUrl(href, code)])),
    'x-default': absoluteUrl(href, routing.defaultLocale),
  }
}

/** The generated social card, app/[locale]/opengraph-image.tsx: one per locale, at /<locale>/opengraph-image/card. */
export const socialCard = { id: 'card', width: 1200, height: 630 } as const

// Open Graph wants language_TERRITORY. `ar_AR` is Facebook's code for Arabic with no single country.
const ogLocales: Record<Locale, string> = { en: 'en_US', ar: 'ar_AR' }

type PageMetadataInput = {
  locale: Locale
  /** The path without its locale prefix, e.g. '/portfolio'. */
  href: string
  title: string
  description: string
  /** The page's own social image; the locale's social card otherwise. */
  image?: { url: string; width: number; height: number; alt: string }
}

// One page's title, description, canonical URL, language alternates and Open Graph card. See docs/seo.md#rules-for-every-public-page
export async function pageMetadata({ locale, href, title, description, image }: PageMetadataInput): Promise<Metadata> {
  const url = absoluteUrl(href, locale)
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(href),
    },
    // A page's openGraph replaces the segment's file-based card instead of merging with it, so the card is named here.
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      locale: ogLocales[locale],
      alternateLocale: routing.locales.filter((code) => code !== locale).map((code) => ogLocales[code]),
      siteName: t('name'),
      images: [
        image ?? {
          url: absoluteUrl(`/opengraph-image/${socialCard.id}`, locale),
          width: socialCard.width,
          height: socialCard.height,
          alt: t('image.alt'),
        },
      ],
    },
    twitter: { card: 'summary_large_image' },
  }
}
