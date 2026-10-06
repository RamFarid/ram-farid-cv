# Decisions

Newest first. Each entry gives the decision, why it was made, and what it constrains. When a decision is reversed, mark the old entry *Superseded* and link the new one; don't delete it.

## 2026-10-06: Availability is a console setting, and everything that states it reads it

- **Decision:** the hard-coded `isAvailableForWork` becomes `Profiles.availability.workTypes`, edited in a new "01 Availability" panel on the console's home page: any of freelance, full-time, part-time and contract (none = not taking work). The intro badge, `llms.txt` and the coming FAQ answers are built from it. Until the first save the site uses freelance and full-time.
- **Why:** Ram asked for FAQ answers that stay true when his availability changes, which means one stored value that every statement reads, not copy to remember to edit.
- **Rejected:** a single on/off toggle (it can't say which kind of work); one exclusive choice (Ram can be open to freelance and a full-time role at once); storing it in `HomeContents` (it's a fact about Ram that `llms.txt` and later pages use, the case `Profiles` was created for).
- **Constrains:** any copy that states availability reads `getAvailability()`. A new kind of work is a code change in `workTypes` plus both message bundles. Details: `console.md#availability`.

## 2026-10-06: SEO/AEO/GEO round: site-wide files, entity graph, social cards and Next.js caching

- **Decision:** after a full audit of the live site, add `robots.ts`, `sitemap.ts`, `/llms.txt`, `favicon.ico` and `apple-icon.png`; move the home page to `pageMetadata()` with a `ProfilePage` / `WebSite` / `Person` JSON-LD graph built from the home content; generate a per-locale social card with `next/og`; turn off next-intl's hreflang `Link` header; cache `/api/cv` for 7 days with a purge on every save it reads from. `x-default` stays the English page.
- **Why:** robots and sitemap returned 404 on the live site, the home page (the one about Ram) had no canonical, hreflang, Open Graph or structured data, and the `Link` header's `x-default` contradicted the HTML. The CV took about 6 s per download. `llms.txt` is cheap when generated from the same sources as the pages.
- **Rejected:** keeping the `Link` header in agreement by moving `x-default` to the unprefixed URL (it 307s by `Accept-Language`; a 200 page is the plainer signal, and one source is simpler); fetching fonts from Google at build time for the card (network at build; the static TTFs are committed instead); a hand-written `llms.txt` (it would drift); `use cache` / Cache Components for the CV (a large switch for one route; a static route handler and `revalidatePath` do it).
- **Constrains:** a page's `openGraph` must keep naming an image (`pageMetadata()` does it), or it drops the card. Social-card copy must avoid mixing scripts inside one word. Any new save that changes what the CV, the sitemap or `llms.txt` read must purge them. Details: `seo.md`, `cv.md#caching`.

## 2026-10-06: The seed carries the real launch content and replaces its own placeholders

- **Decision:** before deployment, `npm run db:seed` carries full case studies (EN + AR) for Ramlyon, HISTORY game and a third project, St Mary Maadi, from Ram's CV and the live sites. On a project that exists, the seed now fills a field (per locale for localized ones) while it's missing, blank or still an earlier seed's `TODO:` placeholder, never otherwise. Story HTML comes from the console's own `storyHtml()`, run under `--conditions=react-server`. St Mary Maadi joins the CV's Selected Projects, pushed once into an existing CV setup.
- **Why:** the site goes live from a seeded database, and the old rule (fill only missing fields) left the first seed's `TODO:` copy in place forever. Running the real pipeline means the seed can't drift from what a console save stores.
- **Rejected:** hand-writing the story HTML next to the Markdown (it drifts from the sanitizer's output); overwriting existing projects (would destroy console edits); guessing the start dates of HISTORY and St Mary Maadi (only Ram knows them).
- **Constrains:** content in the seed must never contain `TODO:` unless it's a placeholder meant to be replaced. Details: `database.md#seeding`.
- **Update, same day:** the seed now owns its images too (logo covers, the six Sololearn certificates, the portrait), kept in `scripts/seed-assets/` and uploaded to fixed R2 keys only while missing, so a new database or bucket comes up complete. Rejected: storing only the URLs of objects uploaded once by hand (a deleted object could never be restored) and generating covers at seed time (sharp isn't a declared dependency). Ramlyon stays off the CV's Selected Projects: it's already the main experience role.

## 2026-10-05: The CV is generated from the site, not uploaded

- **Decision:** `/api/cv` renders the CV as a PDF from the site's content (experience roles, skill groups, certificates, projects, the facts in `lib/profile`) and a CV setup edited at `/console/cv` and stored in `Profiles.cv`. The console page has Save (the public CV) and Download one-time (a PDF of the unsaved draft for one application, never stored). The PDF upload of 2026-10-04 is removed entirely: code, R2 folder and record. The CV is English only, laid out for applicant tracking systems, with `@react-pdf/renderer` and the PDF standard font Helvetica. The CV summary and project bullets are written for the CV alone. An "Architecture" skill group joins the site's skills.
- **Why:** Ram's idea: one source of truth, so the CV can't drift from the site, and a tailored CV per application without touching the public one. ATS compatibility was Ram's hard rule: a standard font extracts exactly, one column reads in order, and hyphenation is off so keywords stay whole.
- **Rejected:** keeping the upload as a fallback (Ram: "fully purge it"); a headless browser printing HTML (heavy, and hosting is undecided); embedding the brand fonts (the site has only variable WOFF2, which react-pdf can't read, and an embedded subset extracts less reliably); reusing the case studies' deliverables as CV bullets; caching in this step (moved to the SEO/AEO/GEO turn).
- **Constrains:** the CV's text must stay in Latin-1 (English); the 7-day cache, when it comes, must be purged by every save the CV reads from (CV, experience, skills, certificates, projects), never by a one-time download. Roles are ordered by date on the CV (newest first), with no manual order. Details: `cv.md`.

## 2026-10-05: Experience as a vertical timeline, roles in the console

- **Decision:** the home page gets an Experience section after About: a vertical timeline, oldest first and ending at today, with cards alternating around a centre line from `lg` and the dates opposite them (pinned while the card scrolls past). Work roles are a `HomeContents.experience` list edited in the console and ordered by date; the university is built from `lib/profile`. The nav gets a sixth link, and the language switch shrinks to the other language's mark («ع» / "EN").
- **Why:** a visitor wants the facts of each role at a glance: when, what, where. The CV builder needs the same roles, so one source (the console) feeds both. Six links were Ram's call.
- **Rejected:** a Gantt-style time axis with one lane per role (built first the same day; precise about overlaps but slow to read, Ram said); sticky cards like Ram's St Mary timeline (too heavy with this much content, so the dates stick instead); manual ordering (the dates already decide it); a university entry in the console (it would drift from the computed study year); drawing graduation ahead of time (Ram: the end of college isn't experience).
- **Constrains:** section indexes moved (Experience 03 to Contact 07). Nav links now show from `lg`, not `md`.
- **Details:** `home.md#experience`, `console.md#experience`.

## 2026-10-05: LinkedIn back, in Messenger's place

- **Decision:** LinkedIn (`linkedin.com/in/ramfarid`, a `profile` channel) replaces Messenger in `contactChannels`. The footer is unchanged (GitHub, Email, WhatsApp).
- **Why:** the CV links LinkedIn, and the CV is to be generated from site data. Swapping one channel for another keeps the contact grid at six tiles.
- **Constrains:** as a profile, LinkedIn gets `rel="me"` and becomes part of `Person.sameAs` in the SEO step.

## 2026-10-05: Location, education and languages are site content, computed or fixed in code

- **Decision:** the home page's About section lists where Ram is based (Cairo, Egypt), education and languages. Languages are a constant in `lib/profile`. The study year is computed from the date (a new year each 21 July, graduation 2028-07-21), like the years-of-experience figure. Neither is editable in the console.
- **Why:** the CV is to be generated from site data, and both facts were missing from it. A computed year can't go stale, and nothing here changes by hand.
- **Constrains:** copy names the university without a degree title ("Computers and AI · Capital University · Formerly Helwan University"), as Ram asked.
- **Details:** `home.md#location-education-and-languages`.

## 2026-10-04: The CV: one PDF in R2, a draft until saved, stored in `Profiles`

*Superseded on 2026-10-05 by "The CV is generated from the site, not uploaded". `Profiles` stays, holding the CV setup.*

- **Decision:** the CV is uploaded from the console's main page as a PDF (up to 10 MB) straight to R2 with a presigned PUT, under a new key each time (`cv/<uuid>.pdf`). Like images, it goes live only on Save, and the replaced file is deleted after the save. Its record lives in a new single-document `Profiles` collection, not in `HomeContents`, because the button is in the nav of every public page. A save revalidates the whole `[locale]` layout. `CV_URL` is gone.
- **Why:** a new key per upload keeps the immutable cache header honest behind Cloudflare; Save/Discard matches every other console section; `Profiles` is the home for later site-wide facts (the availability toggle) without tying them to the home page's content.
- **Rejected:** overwriting one fixed key (a CDN would keep serving the old CV); uploading through the app server (files never pass through it, `console.md#uploads`).
- **Constrains:** visitors save the file as `Ram-Farid-CV.pdf` through a signed `Content-Disposition: attachment`, so the browser's PUT must send that exact header. Details: `console.md#cv`.

## 2026-10-04: Projects console: one draft per project, published projects stay complete

- **Decision:** the console's projects index lists every project with quick actions that save at once (star, publish, reorder, delete a draft); each project is edited on its own page (`/console/portfolio/[project_id]`, the database id) as one local draft. A draft saves with an English title; publishing needs the full case study in both languages, and a published project's saves are held to the same check. Only drafts can be deleted. Every write revalidates the home page, `/portfolio` and every case study.
- **Why:** quick actions shouldn't need a page load; a project is one document, so one Save is honest; a live case study with half its Arabic missing is worse than an unpublished one; revalidating the whole case-study route covers neighbours and slug changes without bookkeeping.
- **Constrains:** to save work in progress on a live project, unpublish it first. The two seeded projects are live with `TODO:` copy and must be completed (or unpublished) before their first console save.
- **Details:** `portfolio.md#console`.

## 2026-10-04: Starred projects get a Recommended badge, not a selection

- **Decision:** `starred` (Ram's word from the old dashboard) is back on `Projects`, as a "Recommended" badge on the portfolio index, its All projects list and the case study. It doesn't change the order or the home page.
- **Why:** Ram wants to point visitors at the projects he recommends; the home page's selection by order (decided earlier the same day) stays.
- **Constrains:** amends "Home page: the first two projects by order, then /portfolio": a flag exists again, but it selects nothing.
- **Details:** `portfolio.md#starred`.

## 2026-10-04: Project stories: Markdown with in-place preview, HTML made on save

- **Decision:** stories are written in a CodeMirror 6 editor with an Obsidian-style live preview styled like `story-prose`. The Markdown is kept in `storyMarkdown`; on save, unified (`remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-sanitize`, `rehype-stringify`) makes the sanitized HTML in `story`, which the site renders as-is. Approved by Ram along with the packages.
- **Why:** Ram asked for the preview inside the input and for HTML stored in MongoDB for rendering speed. The editor and the saver speak the same dialect (CommonMark + GFM), the parser never ships to visitors, and the editor loads only on the edit page.
- **Rejected:** split or tabbed previews (Ram chose in-place); `codemirror-markdown-hybrid`, Milkdown Crepe, TipTap and `@uiw/react-codemirror` (reasons in `portfolio.md#story-editor`); `marked` + `sanitize-html` and `markdown-it` + DOMPurify (a second parser or jsdom on the server).
- **Constrains:** story images must be in our R2 bucket; raw HTML is dropped. A change to the dialect must change the editor (`editor.ts`) and the saver (`markdown.ts`) together.
- **Details:** `portfolio.md#story-html`, `portfolio.md#story-editor`.

## 2026-10-04: Tool logos in brand colours, from a static config

- **Decision:** a project's stack is picked from `lib/projects/stack.ts` (89 tools with Simple Icons logos, CC0, copied in) and shown as tags with each logo in its brand colour. Near-black brand colours draw in the text colour; inside a violet field the tag becomes a dark chip. Tools are added by editing the file. This replaces free-text stack tags and the old dashboard's Framework and Styles radios.
- **Why:** Ram asked for logos as static content he chooses from, in brand colours ("always", over single-colour or colour-on-hover).
- **Constrains:** the only place the site shows colours beyond the one violet. Check light brand colours when the light theme ships.
- **Details:** `portfolio.md#stack`.

## 2026-10-04: Console messages: three states in the URL, read on view, delete only from the archive

- **Decision:** the inbox files messages as `new`, `read` or `archived` and filters them as Inbox, Unread and Archived. The filter and the open message are in the URL. A message is marked read from the client after it's shown. Delete is permanent and only allowed for archived messages, behind an inline second click. Reply is a `mailto:` with a subject in the visitor's language.
- **Why:** the Telegram button and the back button have to land on the same view; a GET that changes data would be triggered by link previews and prefetches; archiving first makes a mistaken delete unlikely without a confirm dialog; a few messages a week don't need a help-desk model or an in-console mail client.
- **Constrains:** status changes go through `setMessageStatus` and revalidate the console layout (the rail's count). The Telegram link is `/console/contact-msgs/<id>`.
- **Details:** `console.md#messages`.

## 2026-10-04: Console: bilingual, section-by-section saves, Telegram sign-in

- **Decision:**
  - The console lives under the locale like the site (`/en/console`, `/ar/console`) and is fully bilingual.
  - Sign-in: a six-digit code from the Telegram bot to the "Ram OTPs" group, stored hashed in `Otps` (5 minutes, single use, five tries). Success sets an opaque random session token in an httpOnly cookie, stored hashed in `Sessions` for 14 days. No session secret.
  - The home page's editable content (About heading and paragraphs, client count, portrait, services, skill groups, certificates) moved from `messages` and `lib/profile` into one `HomeContents` document. Each section saves on its own and revalidates the home page in both locales.
  - Every text field is edited with `LocalizedField`: the page's locale first, the other languages behind a locale-code popover.
  - Images go straight from the browser to R2 with presigned PUTs from `@aws-sdk/client-s3`.
- **Why:**
  - Ram asked for the multi-language input to default to the site's current locale, and English and Arabic are equal citizens (`PRODUCT.md`).
  - An opaque token looked up in the database can be revoked by deleting a row, so it needs no signing secret (Ram questioned the secret).
  - Per-section saves keep a half-finished edit in one section from blocking another, and make the unsaved state visible in the rail.
  - Ram chose the AWS SDK; presigned PUTs keep files off the app server and clear of the 1 MB Server Action body limit.
- **Constrains:**
  - Every console page and Server Action checks the session (`lib/auth/session.ts`).
  - Content edited in the console never goes back into `messages`; those bundles hold UI copy only.
  - The R2 bucket needs a CORS rule for browser `PUT`s from every console origin.
  - Later managers (messages, projects) reuse the rail, `SectionPanel`, `SortableList`, `ImageUpload`, `LocalizedField` and `TagInput`.
- **Details:** `console.md`, `database.md`.

## 2026-10-04: Portfolio: the index teases, the case study proves

- **Decision:**
  - `/portfolio` is a sideways film strip of every published project in console order, with no filters. Each frame shows only the cover, title, kind · year and the one-sentence summary, and a contents list sits below the rail.
  - `/portfolio/[project_id]` (the `slug`) is a full case study for every project, gallery first. A compact head (facts, live link, repo link only for public repos) leads into up to 15 desktop and phone screenshots in justified rows, then overview, deliverables and the story.
  - The story is HTML per locale, stored sanitized and rendered with `dangerouslySetInnerHTML`.
  - Covers and screenshots are in R2.
  - `startedAt`/`endedAt` replace `year`.
- **Why:**
  - Ram rejected an index carrying every fact, because it left the case study with no reason to exist.
  - Ram chose the film strip and gallery-first structures from rolled options.
  - HTML over Markdown is Ram's choice, so nothing is parsed at render time.
  - 6–15 projects don't need filters.
- **Constrains:**
  - Nothing beyond the teaser fields goes on the index.
  - The console's save action must sanitize story HTML against the allow-list in `portfolio.md#story-html` before it reaches the database. It also has to revalidate the pages listed in `portfolio.md#rendering`.
  - `R2_PUBLIC_URL` must be set wherever project images are built or served.
  - The frame focus effect is driven by the `FilmStrip` island, because Chromium's inline view timelines fail in RTL scrollers.
- **Details:** `portfolio.md`, `database.md#projects-model-project`.

## 2026-10-04: Contact channels, and which ones the footer shows

*Superseded in part* (2026-10-05): LinkedIn replaced Messenger; see "LinkedIn back, in Messenger's place".

- **Decision:** six channels in `lib/profile` (`contactChannels`): Email (`ram@ramfarid.com`), WhatsApp, Messenger, GitHub, Facebook and Instagram. The contact section lists all of them; the footer lists GitHub, Email and WhatsApp. LinkedIn is dropped.
- **Why:** Ram asked for these six in the contact section, with a fitting subset in the footer. The footer keeps the professional profile and the two direct lines, and the personal social profiles stay with the form. Ram chose `ram@ramfarid.com` as the public address, which settles the earlier "no email on the site without confirmation" rule.
- **Constrains:** `profile` channels carry `rel="me"` and feed `Person.sameAs` in the SEO step. Channel names come from `Common.channels`.
- **Details:** `contact.md#channels`.

## 2026-10-04: Contact form: hand-submitted Server Action, Turnstile without a library, Telegram after the response

- **Decision:**
  - The contact form calls its Server Action from `onSubmit` (`useTransition`), not through `<form action>`.
  - Turnstile is rendered explicitly from a small component of our own, with no wrapper package.
  - The Telegram notification runs in `after()` once the message is saved, and its failures are only logged.
  - Success is an inline confirmation, not a toast.
- **Why:**
  - React resets a `<form action>` form after every submission, failed ones included, so a Turnstile or server error would wipe the visitor's message. Progressive enhancement is moot because Turnstile needs JavaScript.
  - The Turnstile API we need is three calls, not worth a dependency.
  - The visitor shouldn't wait on Telegram or see its errors once the message is safely stored.
  - A lasting confirmation is clearer than a toast, and it avoided adding Sonner for one message.
- **Constrains:**
  - Other public forms follow the same pattern: shared `*ZSchema` with error keys, a hand-submitted action, Turnstile through `components/Reusable/forms/Turnstile.tsx`.
  - Absolute links sent outside the site use `siteUrl` from `lib/seo/site.ts`.
- **Details:** `contact.md`.

## 2026-10-04: Home page: the first two projects by order, then /portfolio

- **Decision:** the home page's two project bands show the first two published projects by console `order`, not a hand-picked set. The bands are compact (screenshot at half width on desktop, an `h2` title, `space-8` padding). The Work heading carries **See all projects**, linking to `/portfolio`. The `featured` flag is removed from `Projects`.
- **Why:** Ram: hand-picking specific projects for the home page isn't recommended. Order is the one ranking the console already controls, so the home page follows it, and `/portfolio` holds the full record.
- **Constrains:** `/portfolio` is the next page to build; until then the link 404s. Amends "Home page: work first, in project bands" (2026-10-03): the bands stay, their selection and size change.

## 2026-10-03: Violet fields remap colour roles instead of per-component variants

- **Decision:** a region on violet gets the `field-violet` utility. It reassigns the colour roles inside it (`--ink`, `--primary`, `--on-primary`, `--line`, `--focus`, …) to the violet pair, so every primitive switches to on-primary ink on its own. There are no `tone="onViolet"` props.
- **Why:** step 2 asked for an on-violet variant of every primitive. One scope gives all current and future components that variant, and it can't be forgotten on a new one.
- **Constrains:** inside a field, `primary` means the dark ink. For the real violet and its ink, use `violet-fill` / `violet-ink` (resolved once on `:root`). `success` and `warning` aren't remapped, so don't put a StatusBadge on violet.
- **Amended 2026-10-04:** `danger` and the caret colour are remapped to the dark ink too, for the contact form's errors. Errors there are told apart by text, an icon and a doubled border.
- **Details:** `design-system.md#violet-fields`.

## 2026-10-03: `cn()` knows the design-system tokens

- **Decision:** `cn()` uses `extendTailwindMerge` with the token names for text styles, `space-N` spacing, `shadow-glow` and the `page`/`measure` containers. Approved by Ram.
- **Why:** plain tailwind-merge read `text-label` as a colour, so `cn('text-label', 'text-ink')` silently dropped the size, and `space-N` steps never replaced each other.
- **Constrains:** a new text, spacing or shadow token is added to `src/utils/index.ts` as well as `globals.css`.

## 2026-10-03: Home page is static, regenerated daily

- **Decision:** the home page reads MongoDB at build time and has `revalidate = 86400`.
- **Why:** fast, indexable HTML, and the "years of experience" figure stays current. When the console exists, saving a project will revalidate the page on demand.
- **Constrains:** `next build` needs a reachable `MONGO_URI`.

## 2026-10-03: Telegram contact notification: text plus two buttons

- **Decision:** the contact notification shows the sender's email and phone as plain message text (Telegram makes both tappable). The only inline buttons are **WhatsApp** (`https://wa.me/<number>`, only when a phone was given) and **Show in console**.
- **Why:** Telegram inline-button URLs accept only `http(s)://` and `tg://`, so `mailto:` and `tel:` buttons aren't possible. Ram chose plain text over workarounds (Gmail compose links, redirects through the site).
- **Details:** built in the Telegram step; config in `src/lib/telegram/config.ts`, secrets in `.env`.

## 2026-10-03: Mongoose naming and localized fields

- **Decision:** models are singular and capitalized (`ContactMsg`); collections are plural and capitalized (`ContactMsgs`) and always passed explicitly to `mongoose.model()`. User-facing text fields are a required `{ en, ar }` sub-schema.
- **Why:** Ram's convention; without the explicit name, Mongoose lowercases and pluralizes it. One document holding both locales keeps non-text fields from drifting between languages.
- **Details:** `database.md`.

## 2026-10-03: Home page: work first, in project bands

- **Amended 2026-10-04:** see "Home page: the first two projects by order, then /portfolio" (selection by order, compact bands, link to /portfolio).
- **Decision:** the home page leads with the work. A short intro strip (one heading, Start a project as the primary action, Download CV as the secondary), then one full-width band per featured project (the first on a violet field, the second on `surface`). Then About + stats, Services, Skills, Certifications, and Contact on a violet field. Violet fills whole regions, as the design system's Cover blocks do.
- **Why:** clients first, recruiters second; the two live projects are the strongest proof. Chosen by Ram over a letter-style page, a stats-led hero, a block mosaic and a split hero.
- **Constrains:** on violet fields, text, tags and the focus ring use `on-primary`, never `primary-ink` or the default violet ring. `/portfolio` is out of scope until the home page ships. Product context is in `PRODUCT.md`.
- **Details:** `home.md` (sections, constraints, build steps).

## 2026-10-03: Pin `@swc/core` to 1.16.2 (temporary)

- **Decision:** `package.json` has `"overrides": { "@swc/core": "1.16.2" }`.
- **Why:** next-intl's plugin loads `@swc/core` (for its message extractor) when the config loads. From 1.16.12, SWC's native loader refuses to run when a parent folder of its cache, including the drive root, is modifiable by Authenticated Users. On Ram's machine both `C:\` and `E:\` are, so `next build` and `next dev` crashed. 1.16.2 has no such check and fits next-intl's `~1.16.0` range.
- **Remove when:** the drive-root permissions on the dev machine are tightened, or SWC relaxes the check. Then delete the override, run `npm install` and confirm `npm run build` works. CI and hosting machines aren't affected.

## 2026-10-03: next-intl with `always` prefixes and the bare `ar` locale

- **Decision:** next-intl's default routing (`/en`, `/ar`; detection by cookie, then `Accept-Language`, then `en`). The locale code is `ar`, not `ar-EG`.
- **Why:** Ram asked for next-intl's own approach. The bare `ar` keeps Western digits in CLDR formatting.
- **Details:** `i18n.md`.

## 2026-10-03: Tailwind defaults removed; design tokens only

- **Decision:** `globals.css` resets Tailwind's colours, type scale, radii, shadows, easings and font families (`--*: initial`) and defines only the design-system tokens. Spacing keeps Tailwind's 4px numeric scale and adds the named `space-N` steps.
- **Why:** an off-system class (`text-lg`, `bg-zinc-900`) then produces no CSS, so drift shows up immediately. A 4px base matches the design system's grid, so numeric spacing stays on-grid.
- **Constrains:** a new colour, text style or radius means a new token, added in Claude Design first.
- **Details:** `design-system.md#tokens`.

## 2026-10-03: Font stack leads with a unicode-range Arabic face

- **Decision:** `font-sans` = Readex Arabic (Arabic code points only, no fallback face) → Readex Latin (with next/font's adjusted Arial) → system-ui.
- **Why:** next/font's Arial fallback has Arabic glyphs. Placed ahead of the Arabic face, it would render Arabic in Arial for good.
- **Details:** `design-system.md#fonts`.

## 2026-10-03: Stay host-portable until hosting is chosen

- **Decision:** the app must run unchanged on Vercel or on a VPS with Coolify (leaning about 30:70 toward the VPS).
- **Why:** the hosting choice is still open, and Cloudflare sits in front either way.
- **Constrains:** Node runtime; no platform-only services (Vercel Blob/KV/Edge Config); files go in R2; configuration only through env vars.

## 2026-10-03: Files in Cloudflare R2

- **Decision:** the CV file (one universal file) and other uploaded files are stored in R2 and managed from `/console`.
- **Why:** it's already in the Cloudflare account, and it doesn't depend on where the app is hosted.

## 2026-10-03: Telegram as an operational channel

- **Decision:** notifications (contact messages first) and actions go through a Telegram bot posting to the "Contact Notifications" group. Bot updates are received under `app/api/`.
- **Why:** Ram runs the site from Telegram as much as from `/console`.

## 2026-10-03: No 3D cube

- **Decision:** there's no cube or face-based navigation, even though the design-system README mentions cube motion. Ignore those motion notes.

## 2026-10-03: Tailwind CSS 4 for styling, not MUI

- **Decision:** style with Tailwind 4, driven by CSS variables generated from `docs/design-system/tokens.json`.
- **Why:** Tailwind 4 was already scaffolded. A CSS-variable theme gives one place to change a token for both themes, and logical-property utilities cover RTL. MUI would add a second styling system and its runtime for a small site.
- **Constrains:** no component library. Build primitives in `src/components/ui/`.

## 2026-10-03: Library set

- **Decision:** Zod, Mongoose, Jotai, date-fns, next-intl, lucide-react, clsx + tailwind-merge (`cn()`), Sonner, nodemailer. Cloudflare in front of the site.
- **Why:** Ram's standing stack.
- **Status:** as of this date only Next, React, Tailwind, clsx and tailwind-merge (for `cn()`) are installed. Add each library when the first feature needs it. Added 2026-10-03 with the data foundation: Mongoose, Zod, `server-only`, and tsx (dev, for `scripts/`). Added 2026-10-03 with the home page UI: lucide-react, date-fns. Added 2026-10-04 at Ram's request: react-photo-view (the certificate viewer).
- **Constrains:** no overlapping libraries (no other state, validation, icon or toast libraries) without asking.

## 2026-10-03: Zod vs Mongoose naming

- **Decision:** Zod schemas are named `*ZSchema`. `*Schema` means a Mongoose schema.
- **Why:** both libraries call their objects "schemas". The suffix tells at a glance which side of the boundary a schema belongs to.

## 2026-10-03: `docs/` as shared memory

- **Decision:** `docs/` holds architecture, feature contracts and decisions for every human and AI contributor. `CLAUDE.md` stays a short rule sheet.
- **Why:** sessions and agents don't share context; the repo does.
