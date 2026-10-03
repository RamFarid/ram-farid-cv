// The site's public origin, for absolute links: the ones sent outside the site (Telegram buttons) and, later, canonical URLs and
// JSON-LD. SITE_URL overrides it, e.g. for a preview deployment. See docs/seo.md
export const siteUrl = (process.env.SITE_URL || 'https://ramfarid.com').replace(/\/$/, '')
