import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteUrl } from '@/lib/seo/site'

// Every crawler, AI crawlers included, may read the public site; the console and the API stay out, except the CV.
// See docs/seo.md#site-wide-files
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/cv'],
      disallow: ['/console', ...routing.locales.map((locale) => `/${locale}/console`), '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
