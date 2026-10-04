# Home page

The plan for `/[locale]` (the home page), agreed with Ram on 2026-10-03. Who the site is for and why is in `PRODUCT.md`; the layout decision is in `decisions.md` ("Home page: work first, in project bands").

## Job

- **Audience:** freelance clients first, hiring teams second.
- **Primary action:** **Start a project**, which scrolls to the contact form. **Secondary:** **Download CV**, from R2. Both appear in the intro; the CV is also in the nav.
- **Proof:** the two live client projects, figures computed live, and the certificates themselves, viewable full size. No testimonials, invented metrics or client logos.

## Structure: work first, in project bands

The work leads. The first two published projects by console `order` each get a compact full-width band; nothing is hand-picked, and the rest live in `/portfolio` (linked from the Work heading). Violet (`primary`) fills whole regions (project 1's band and the contact section), the way the design system's Cover blocks do, not just accents.

0. **Nav:** the design system's floating `NavBar`: the R icon with "Ram", up to five section links (Work, About, Services, Skills, Contact), the language switch labelled in the other language, and **Download CV** as a small secondary button. There's no primary button in the nav, because the intro already has one.
1. **Intro strip:** on the dot grid, about 40% of the viewport height so project 1's band starts above the fold. The page's only `h1` ("I build fast, clear web apps.", with "web apps" in `primary-ink`), a first-person lead naming Ram, an availability `StatusBadge`, then **Start a project** (primary) and **Download CV** (secondary).
2. **Project band 1, on a violet field, full width:** the Work heading with **See all projects** (to `/portfolio`) at its end, then a 16:9 screenshot (half the width on desktop), `kind · year`, the title, a one-sentence summary, the client, stack tags and **Visit live site**.
3. **Project band 2, on `surface`:** the same anatomy, so the two bands alternate.
4. **About + stats:** the portrait and a first-person paragraph that opens with a plain one-sentence answer (AEO/GEO). Three figures, each in a form that fits it: years (calculated live from 2021-11-13), 16 clients, and the count of published projects.
5. **Services:** what a client can hire Ram for, in plain outcomes: new web apps, rebuilds, multilingual products, performant server management. Full width, one ruled row each.
6. **Skills:** groups in a three-column grid, below Services on the same `surface` band. Tech names are mono `Tag`s in Latin script; practices (database design, authorization, background jobs) are translated and set in the sans. Edited in the console (`console.md#skills`).
7. **Certifications:** a gallery of the certificates themselves (see Certifications below).
8. **Contact, on a violet field:** the form (name, email, optional phone, message; Turnstile) and every contact channel: Email, WhatsApp, LinkedIn, GitHub, Facebook, Instagram. This is where the page ends. Contract: `contact.md`.
9. **Footer:** the full logo lock-up, the footer channels (GitHub, Email, WhatsApp) and copyright.

## Constraints

- **Violet fields:** text, tags, buttons and the focus ring use `on-primary`. Never use `primary-ink` text there or the default violet ring, which is invisible on violet.
- **Phones:** each band stacks (screenshot, then text), with no horizontal scroll.
- **RTL:** English and Arabic ship together; logical utilities only.
- **SEO:** one `h1`, `<section aria-labelledby>` per section, `<article>` per project. JSON-LD (`Person`, `WebSite`, `ProfilePage`) comes from `lib/seo`. See `seo.md`.
- **Motion:** one section-reveal style, arrow nudges on links, all off under `prefers-reduced-motion`.
- **Data:** projects come from `Projects` (`status: published`, sorted by `order`, first two). The read path is page → `lib/projects` → `lib/db/projects.ts`. See `database.md`.
- **See all projects** links to `/portfolio`, built 2026-10-04 (`portfolio.md`).

## As built (steps 2–4)

- **Files:** primitives in `src/components/ui/` (see `design-system.md#components-built`); the header, footer, mobile menu, language switch and CV button in `src/components/Reusable/site/`; the sections in `src/components/Home/`.
- **Data:**
  - Projects: page → `lib/projects` (resolves `{ en, ar }` to the page locale) → `lib/db/projects.ts`.
  - Profile facts (career start, availability, contact channels, CV URL): `lib/profile`. The figures are computed there and formatted with next-intl, never typed into copy.
  - The About heading, paragraphs, client count and portrait, the services, the skill groups and the certificates: the `HomeContents` document, edited in the console (`console.md#home-content`), read through `lib/home`. A section with no content is hidden.
- **Violet:** project band 1 uses `field-violet` (`design-system.md#violet-fields`). Bands alternate violet and `surface`, and the screenshot swaps sides.
- **Motion:** project screenshots rise into their band as it scrolls in, and the nav bar gains its shadow over the first 64px of scroll. Both are CSS scroll-driven animations with no JavaScript. They're off under reduced motion, and content stays visible where scroll timelines aren't supported. Arrows nudge 3px on hover.
- **Section indexes** follow the brand book's "01 / Work" eyebrows: Work 01, About 02, Services 03, Skills 04, Certifications 05, Contact 06.
- **Header:** fixed, so the intro's dot grid runs under it. The skip link goes to `#main`. Under `md`, the links and the CV button move into the menu.
- **Download CV** links to the PDF uploaded in the console (`console.md#cv`) and is a disabled button until one is saved.
- **Placeholders:** a missing screenshot or portrait shows a mono monogram, never a stock image.

## Location, education and languages

Added with Ram on 2026-10-05 as groundwork for building the CV from site data. Three ruled rows under the About figures (`AboutFacts`), as a `<dl>`.

- **Based in:** "Cairo, Egypt" («القاهرة، مصر»), from `Profile.location` in messages.

- **Education:** "Computers and AI · Capital University", then "Formerly Helwan University · Third year, graduating July 2028". Ram asked for the university by name and no "Bachelor of". The names are in messages (`Profile.education`), so the Arabic page reads «الحاسبات والذكاء الاصطناعي · جامعة العاصمة».
- **The study year is computed, never edited:** `getStudyYear()` in `lib/profile`. There are four years, each starting on 21 July, and graduation is 21 July 2028. So it's year 3 until 2027-07-20, year 4 from 2027-07-21, and from 2028-07-21 the row reads "Graduated July 2028". The flip is at 00:00 UTC; the static home page shows it within a day (`revalidate = 86400`).
- **Languages are fixed in code:** `spokenLanguages` in `lib/profile`: Arabic (native) and English (professional working proficiency). Names and levels are in `Profile.languages`.
- None of them is in the console, because none is edited by hand.
- **SEO step:** the full `Person` node should carry `address` (Cairo, `EG`), `knowsLanguage` (`ar`, `en`) and, after graduation, `alumniOf` the university.

## Certifications

Shaped with Ram on 2026-10-04: show the certificate itself, with its name and a description.

- **Gallery:** 3 columns on desktop, 2 on tablet, 1 on phones; 3–8 certificates expected. Each certificate is a 4:3 mat on `surface-raised` with the whole image inside (`object-contain`, never cropped). Below it: the name (as issued, not translated), issuer · date in mono, a one-line description per locale, and up to four skill `Tag`s.
- **Viewer:** `react-photo-view` (Ram's choice). One `PhotoProvider` wraps the gallery, so arrow keys step through every certificate and Esc closes it. Each thumbnail is a labelled `<button>` ("View certificate: <name>"). The caption (name, issuer · date) is passed as each `PhotoView`'s `overlay`, which the library only draws through the provider's `overlayRender`. The banner and arrows are themed from the tokens in `globals.css`. The zoom is near-instant under reduced motion.
- **Server vs client:** only `CertificateViewer.tsx` (provider and thumbnail) is a client component; names, descriptions and tags render on the server.
- **Data:** managed in the console since 2026-10-04 (`console.md#certifications`), images in R2. Without an image, a certificate shows a mat with the issuer's initials and no viewer.
- **Dropped:** the Verify link (not wanted). The section title is "Certificates I’ve earned".

## Rendering

Static, with both locales prerendered and `revalidate = 86400`, so the years figure updates daily. The build reads MongoDB, so `next build` needs `MONGO_URI` (`decisions.md`, "Home page is static, regenerated daily"). Every console save of home content revalidates it in both locales; saving a project will too (phase 3).

## Build steps

Each step stands alone and leaves the app working.

| # | Step | Status |
| --- | --- | --- |
| 1 | Data foundation: Mongoose + Zod, `connectDB()`, `Project`/`ContactMsg` models, seed (see `database.md`) | Done 2026-10-03 |
| 2 | UI primitives: Button, Tag, StatusBadge, SectionHeading, StatCard, TextField, NavBar, footer, each with an on-violet variant, in `src/components/ui/` | Done 2026-10-03 (on-violet through `field-violet`) |
| 3 | Intro strip and the two project bands, reading from `Projects` | Done 2026-10-03 |
| 4 | About + stats, Services, Skills, Certifications | Done 2026-10-03, with placeholder content (see Waiting on Ram) |
| 5 | Contact: form, Turnstile, Server Action (Zod), save to `ContactMsgs`, contact channels | Done 2026-10-04 (see `contact.md`) |
| 6 | Telegram: `src/lib/telegram/config.ts`, notification to the contact group with WhatsApp (when a phone is given) and Show in console buttons; email and phone as plain text | Done 2026-10-04; untested against the real bot until the token and chat id are in `.env` |
| 7 | **Next.** SEO: `lib/seo` metadata helper, JSON-LD, `sitemap.ts`, `robots.ts` | |

Update the status column as each step lands.

## Waiting on Ram

- Project content for **HISTORY game** and **Ramlyon**: client, kind, year, one-sentence summary, stack, live URL, screenshot. The seed has `TODO:` placeholders.
- **Services:** four drafted ones (new web apps, rebuilds, multilingual products, performant server management) are in the console. Confirm or rewrite them there.
- **Certifications:** add them in the console: image, name, issuer, month, a one-line description in English and Arabic, and up to four skills.
- **Arabic copy:** drafted by Claude for Ram to review.
- **Section eyebrows ("01 / Work"):** kept because the brand book pins them for SectionHeading. The design review flagged numbered eyebrows above headings as a template pattern. Keep them, or drop the index (or the whole eyebrow) site-wide in `SectionHeading`?
- **Portrait, availability and CV:**
  - the portrait (upload it in the console);
  - whether to show "Available for work" (shown for now);
  - the CV file (upload it in the console).
- **Secrets for `.env`:** the Telegram bot token and contact group chat id, and the production Turnstile site and secret keys (`.env.example` has Cloudflare's test keys).

## Out of scope for now

Nothing. (`/portfolio` and `/portfolio/[project_id]` were built on 2026-10-04, see `portfolio.md`; the console's home-content manager the same day, see `console.md`.)
