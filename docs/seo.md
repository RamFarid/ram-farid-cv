# SEO, AEO, GEO

Every page has to work for three kinds of reader:

- **Search engines (SEO)**
- **Answer engines (AEO):** featured snippets, voice search
- **Generative engines (GEO):** ChatGPT Search, Perplexity, Gemini, Google AI Overviews

We build for all three from the first page. The finished site is audited with the `seo-geo-aeo` skill, and the results get recorded here.

## Rules for every public page

- **Metadata through `lib/seo`:** title, description, canonical URL, Open Graph and Twitter cards are built by one helper in `lib/seo`, never hand-written in a page. Use `generateMetadata` per locale.
- **Languages:** each page declares `alternates.languages` for `en`, `ar` and `x-default`. `<html lang dir>` matches the locale.
- **Rendered on the server:** content that should be indexed is in the server HTML. Don't render it only on the client or put it behind interaction (tabs and accordions keep their text in the DOM).
- **Semantic HTML:** one `h1` per page, ordered headings, `<main>`, `<nav>`, `<section aria-labelledby>`, `<article>` for projects, and real `<a href>` links.
- **Structured data (JSON-LD)** from `lib/seo`:
  - `Person` (Ram: name in both scripts, `jobTitle`, `sameAs` social profiles, `knowsAbout`)
  - `WebSite`
  - `ProfilePage` for the home page
  - `CreativeWork` / `SoftwareApplication` per project
  - `BreadcrumbList` where pages are nested
  - `FAQPage` only for real questions shown on the page
- **Answer-ready copy:** each section opens with a plain one-sentence answer ("Ram Farid is a full-stack JavaScript engineer in Cairo who…"). Write facts that can be quoted: years (calculated at runtime), number of clients, stack, location, availability.
- **Images:** `next/image`, real `alt` text in both languages, explicit sizes, and modern formats. Generate OG images per locale.
- **Performance:** Core Web Vitals are a ranking input. Server Components by default, minimal client JS, fonts through `next/font`, and no layout shift.

## Site-wide files

- `app/sitemap.ts`: every public URL in both locales, with `alternates`.
- `app/robots.ts`: allow the public site; disallow `/console` and `/api`.
- `/console/**` sends `noindex`.
- `llms.txt`: decide during the SEO pass (record the decision here).
- Icons through the App Router file conventions (`app/icon.svg`, plus `apple-icon.png` once it exists).

## Status

- 2026-10-03: nothing implemented yet.
