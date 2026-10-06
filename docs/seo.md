# SEO, AEO, GEO

Every page has to work for three kinds of reader:

- **Search engines (SEO)**
- **Answer engines (AEO):** featured snippets, voice search
- **Generative engines (GEO):** ChatGPT Search, Perplexity, Gemini, Google AI Overviews

We build for all three from the first page. The finished site is audited with the `seo-geo-aeo` skill, and the results get recorded here (see [Audits](#audits)).

## Rules for every public page

- **Metadata through `lib/seo`:** title, description, canonical URL, Open Graph and Twitter cards are built by `pageMetadata()` in `lib/seo/metadata.ts`, never hand-written in a page. Use `generateMetadata` per locale.
- **Languages:** see [Languages](#languages). `<html lang dir>` matches the locale.
- **Rendered on the server:** content that should be indexed is in the server HTML. Don't render it only on the client or put it behind interaction (tabs and accordions keep their text in the DOM).
- **Semantic HTML:** one `h1` per page, ordered headings, `<main>`, `<nav>`, `<section aria-labelledby>`, `<article>` for projects, and real `<a href>` links.
- **Structured data (JSON-LD)** from `lib/seo/structured-data.ts`; see [Structured data](#structured-data).
- **Answer-ready copy:** each section opens with a plain one-sentence answer ("Ram Farid is a full-stack JavaScript engineer in Cairo who…"). Write facts that can be quoted: years (calculated at runtime), number of clients, stack, location, availability.
- **Images:** `next/image`, real `alt` text in both languages, explicit sizes, and modern formats. An image inside a button that has its own `aria-label` still gets its `alt`: the label names the button for screen readers, the alt is what image search reads.
- **Performance:** Core Web Vitals are a ranking input. Server Components by default, minimal client JS, fonts through `next/font`, and no layout shift.

## Languages

- Each page declares `canonical` and `alternates.languages` for `en`, `ar` and `x-default` in its HTML, through `languageAlternates()`. The sitemap lists the same alternates.
- **`x-default` is the English page** (`/en/...`), a real 200 page, not the unprefixed URL that redirects by `Accept-Language`.
- **The HTML is the only source.** next-intl's middleware also sends hreflang in a `Link` response header, with `x-default` on the unprefixed URL. It disagreed with the HTML, so it's off (`alternateLinks: false` in `i18n/routing.ts`, 2026-10-06).
- `og:locale` is `en_US` / `ar_AR` (Open Graph wants `language_TERRITORY`; `ar_AR` is Facebook's code for Arabic with no country), with the other as `og:locale:alternate`.

## Structured data

Rendered with `components/Reusable/seo/JsonLd`. Pages refer to Ram and the site by `@id` (`${siteUrl}/#person`, `${siteUrl}/#website`); the full nodes live on the home page only.

| Page | Types |
| --- | --- |
| Home | `@graph`: `ProfilePage` (`mainEntity` → Person, `dateModified` = home content's last save), `WebSite`, `Person` |
| `/portfolio` | `CollectionPage` + `ItemList`, `BreadcrumbList` (Home → Work) |
| Case study | `CreativeWork`, `BreadcrumbList` (Home → Work → project) |

The `Person` node is built from the same content the page shows, so it can't drift:

- `name` in the page's script, `alternateName` in the other (`Metadata.name`); `jobTitle` and `description` from `Metadata`.
- `image`: the About portrait. `address`: `homeLocation` in `lib/profile` (Cairo, `EG`). `knowsLanguage`: `spokenLanguages` codes.
- `knowsAbout`: every skill-group item. `hasCredential`: the certificates. `worksFor`: experience roles with no end date.
- `sameAs`: the `profile` contact channels (the ones with `rel="me"`).
- **Not yet:** `alumniOf` the university, once Ram graduates (`home.md#location-education-and-languages`).

`CreativeWork` uses display names for `keywords` (`findStackTool`), `dateCreated` as a date, and the live product as `about` (a `WebSite`), not `sameAs`: the case study isn't the product.

- `FAQPage` only for real questions shown on the page. There are none yet.

## Social cards

- `app/[locale]/opengraph-image.tsx` draws the card for each locale with `next/og`: name, job title, tagline, stack and place on the dark ground with the violet rule. Copy is in `Metadata.image`.
- **A page's `openGraph` replaces the segment's file-based image instead of merging with it**, so `pageMetadata()` names the card (`/<locale>/opengraph-image/card`, `socialCard` in `lib/seo/metadata.ts`) unless the page passes its own image. Case studies pass their cover.
- **Fonts:** Satori reads TTF, OTF and WOFF, not the site's variable WOFF2, so `src/fonts/og/` holds static Readex Pro 400 and 600 (OFL, from Google Fonts, Latin + Arabic).
- **Arabic:** Satori shapes Arabic letters but lays words out left to right. The card's `Line` puts every Arabic word in its own flex item, keeps Latin words together, and orders them with `row-reverse`. Keep card copy to short lines: a line can't wrap. Copy that mixes scripts inside one word (`وReact`) renders wrong; avoid it on the card.
- Twitter uses `summary_large_image` with the same image.

## Site-wide files

- `app/sitemap.ts`: home, `/portfolio` and every published case study, one entry per locale, each with all its alternates. `lastModified` is the last content write the page shows (projects' `updatedAt`; home is the later of the home content and the projects). Static with `revalidate = 86400`; project and home-content saves revalidate `/sitemap.xml`.
- `app/robots.ts`: everyone, AI crawlers included, may crawl the site. Disallowed: `/console`, `/<locale>/console`, `/api/`. `/api/cv` is allowed: the CV is a public, factual document about Ram. Points to the sitemap.
- `/console/**` also sends `noindex`.
- **`/llms.txt`** (decided 2026-10-06: yes): `app/llms.txt/route.ts` serves Markdown per [llmstxt.org](https://llmstxt.org) built by `lib/seo/llms.ts`: the description, the intro with the current availability (`console.md#availability`), the pages, every published project with its summary, the CV and the contact channels. English only, pointing at `/ar`. Every fact comes from messages, the projects and `lib/profile`; only the few headings are in code (machine-facing). Static, `revalidate = 86400`, revalidated by project and availability saves.
- **Icons** through the App Router file conventions: `app/icon.svg` (the brand icon), `app/favicon.ico` (16/32/48 PNG entries) and `app/apple-icon.png` (180 px, square: iOS rounds it). The PNG and ICO were rendered from `icon.svg` with sharp; regenerate them if the icon changes.

## Caching

Next.js side only; the Cloudflare layer is its own round.

| Route | Cache | Purged by |
| --- | --- | --- |
| Home, `/portfolio`, case studies | ISR, `revalidate = 86400` | Console saves (`home.md#rendering`, `portfolio.md#rendering`) |
| `/api/cv` | Static, `revalidate = 604800` (7 days) | CV, home-content and project saves, draft deletes (`cv.md#caching`) |
| `/sitemap.xml` | Static, 1 day | Project and home-content saves |
| `/llms.txt` | Static, 1 day | Project and availability saves |
| `/<locale>/opengraph-image/card` | Generated on first request, then cached until the next deploy | Deploys (its copy is in messages) |
| `/_next/static/*`, `/_next/image` | Immutable, 1 year (R2 objects are never overwritten: new key per upload) | n/a |

## Audits

### 2026-10-06: re-run after deploying `9cf16fa`

SEO 8/10, GEO 8/10, AEO 5/10 (21/30, up from 15/30). Every fix below is live: robots, sitemap (10 URLs with alternates), canonical, hreflang and a social card on all 10 pages, the home JSON-LD graph, `llms.txt`, icons, alt text, and `/api/cv` served from cache. All 18 JSON-LD blocks parse.

New findings: `Person.worksFor` lists "Freelance" as an organization (the ongoing freelance role); leave roles that aren't employers out. Still open: the FAQ, case-study outcomes and length, the "Screens" heading, the home `h1`, Cloudflare email obfuscation. Report: `seo-audits/seo-audit-ramfarid-com-2026-10-06-after-deploy.docx`.

### 2026-10-06: full audit of the live site (before this round's fixes)

Crawled `ramfarid.com` (both locales: home, `/portfolio`, three case studies, robots, sitemap, llms.txt, icons, `/api/cv`). Scores: SEO 5/10, GEO 6/10, AEO 4/10. The report is in `seo-audits/`.

Fixed in this round (needs a deploy to take effect):

- `/robots.txt` and `/sitemap.xml` returned 404 (the `[locale]` route caught them). Added both.
- The home page had no canonical, hreflang, Open Graph or JSON-LD. It now uses `pageMetadata()` and carries the `ProfilePage` / `WebSite` / `Person` graph.
- No social image anywhere except case-study covers. Added the per-locale card.
- hreflang `x-default` disagreed between the `Link` header and the HTML. The header is off.
- `/favicon.ico` and `/apple-icon.png` returned 404. Added.
- `CreativeWork.keywords` were stack ids (`nextjs`); now display names. Breadcrumbs start at Home.
- Gallery screenshots and certificate thumbnails had empty `alt`. They now carry the screenshot's alt and the certificate's name.
- `/api/cv` rendered on every request (about 5.9 s on the live site). It's now cached for 7 days and purged on save.
- No `/llms.txt`. Added.

Open (content or design, Ram's call):

- **AEO:** no question-phrased headings and no FAQ. A short FAQ on the home page (availability, stack, location, how a project starts, Arabic support), shown on the page and marked up as `FAQPage`, is the biggest remaining AEO gain.
- **The home `h1`** ("I build fast, clear web apps.") doesn't name Ram. The lead sentence right below it does, which covers answer engines; adding the name to the `h1` would help classic search.
- **Case-study copy** is short (about 480 words on Ramlyon). Outcomes with numbers (orders handled, load times, users) are what AI engines quote.
- **Case-study `h2`** "Screens" reads as "Screens1 screen" to crawlers because the count sits inside the heading.
- **Function region:** Vercel serves from `iad1` (US East). If the MongoDB cluster is elsewhere, every ISR regeneration pays the round trip; set the region next to the database.
- **Cloudflare round:** HTML is `cf-cache-status: DYNAMIC`; Cloudflare's email obfuscation rewrites `mailto:` links into `/cdn-cgi/l/email-protection` (crawlers and answer engines see no email); a `NEXT_LOCALE` cookie is set when `Accept-Language` disagrees with the URL's locale, which blocks edge caching of that response.
