# Portfolio: `/portfolio` and `/portfolio/[project_id]`

Shaped with Ram and built on 2026-10-04. Who the site is for is in `PRODUCT.md`; the choices that steer later work are in `decisions.md` ("Portfolio: the index teases, the case study proves").

## Job

- **Visitors:** clients and recruiters arriving from the home page's **See all projects**, a shared link or search. Both pages are in Experience mode: the work leads and the interface stays quiet.
- **Division of labour:** the index *teases* and the case study *proves*. The index shows only the cover, title, kind · year and the one-sentence summary. Client, stack, role, dates, live and repo links, the story and the screenshots live only on the case study. Ram rejected an index that carried every fact, because it left the project page with no reason to exist.
- **Primary action:** **Start a project** (`ContactCall`, to the home page's contact form) closes both pages. On the case study, **Visit live site** is secondary and **Source code** a ghost link, shown only for public repos (most client repos are private).

## Index

`/[locale]/portfolio`, chosen by Ram from three structures ("Film strip"), then revised so it only teases.

1. **Head:** the `h1` ("Work I’ve shipped") and a one-line first-person lead on the start side. On the end side: the live published-project count (the figure in mono), then the rail's counter and prev/next buttons. They sit in the head, not under the rail, so the sideways control is in the first view (moved after the finish review). Short, so the rail starts above the fold.
2. **Rail, on a violet field:** every published project in console `order`, one frame each, in a sideways scroll-snap rail. No filters at 6–15 projects; add them only if the count outgrows that.
   - A frame is an `<article>`: the 16:9 cover on a dark slab (`ProjectSlab`; a monogram when there's no cover), the title as an `h2` whose link stretches over the whole frame, `01 · kind · year` in mono, the summary, and a "Read the case study" cue. The meta sits *under* the title: no eyebrows above headings.
   - Frame width is `min(84vw, 840px, max(520px, (100svh - 480px) * 1.77))` (about 750px at 1440×900), so on a laptop the first frame, its title, meta and summary fit in the first view and the next frame peeks in at the end edge. The first frame lines up with the page container (`--rail-inset` in the `film-rail` utility mirrors `Container`'s gutter and centring).
   - **Frame focus:** frames dim (to 35%) and shrink (to 90%) as they leave the rail's view. `FilmStrip` sets `--frame-focus` (the visible fraction, 0–1) on each frame in a `requestAnimationFrame` on scroll; CSS squares it, so a half-visible frame already reads as set back, and applies it under `prefers-reduced-motion: no-preference`. Without JavaScript, every frame stays at full strength.
   - **Rejected: a CSS inline view timeline** (`animation-timeline: view(inline)`), the first build. Chromium's inline view timelines don't work in RTL scrollers: every frame stayed at its pre-entry state in `/ar` (checked 2026-10-04 with the bundled Chromium). Revisit when that's fixed; the island would then only own the counter and buttons.
   - **Controls:** the rail scrolls and snaps natively (touch, trackpad, Shift+wheel, and focusing a link scrolls it into view). The client island adds the mono `01 / 08` counter (laid out LTR in both languages; screen readers get "Project 1 of 8") and prev/next buttons that scroll by one frame, disabled at either end. The scrollbar is hidden because the counter and buttons stand in for it.
3. **Below the rail:** "All projects", ruled rows of number, title and year, each linking to its case study, for anyone who won't scroll sideways and for crawlers. Beside it on desktop: the contact call.

Empty state (no published projects): the head, a one-line note and the contact call.

## Case study

`/[locale]/portfolio/[project_id]`, where `project_id` is the project's `slug`. Ram chose "Gallery first".

1. **Head** (`<header>` inside the page's `<article>`): breadcrumb (Work / title), the `h1`, the summary; on the end side a ruled facts list (client, role, type, timeline) with the stack as `Tag`s, then the links. Under `lg` the facts sit two to a row with the label above the value, so the screens start sooner on phones.
   - **Timeline:** a localized month range (`format.dateTimeRange`) plus a duration from `getProjectDuration()` (days under about six weeks, whole months after that). An unset `endedAt` reads "<start> – present" with no duration.
2. **Screens, straight after the head:**
   - **From `sm`:** justified rows. Each item's flex-grow and flex-basis come from its stored aspect ratio (`--ratio`) and a base row height (220px at `sm`, 300px at `lg`), so desktop and phone shots share one height and every row ends flush, with no JavaScript and no layout shift. Growth is capped at 1.5× so a row that wraps early doesn't balloon; a trailing pseudo-element with a huge flex-grow keeps a short last row from stretching.
   - **Under `sm`:** a two-column grid. Desktop shots span both columns and phones pair up, in source order. A phone without a pair keeps its single cell. Rejected: `grid-flow-dense`, which filled the gaps by reordering screens, so the layout no longer matched the Tab order, the "n / N" captions and the viewer's arrow keys.
   - Every screen is a labelled button that opens in the shared `PhotoViewer` (react-photo-view): arrow keys step through the whole set, Esc closes, and the caption reads "Phone · 3 / 12" (numbers isolated so they keep their order in Arabic).
   - Without screenshots the cover stands in as the only screen; with neither, a monogram mat.
3. **Story, in ruled rows** (a heading on the start side, the text at reading measure on the end side): **Overview** (paragraphs split on blank lines), **What I delivered** (a ruled list), **How I built it** (the story HTML). The role appears only in the facts.
4. **Next project:** the next published project by `order`, wrapping to the first, in the index's vocabulary (dark slab and brief on a violet field, one stretched link). Hidden when there's only one project.
5. **Contact call** on the dot grid, worded for one project ("Have a project like this one?", `ContactCall about="one"`).

## Case-study content

Every published project carries a full case study (Ram, 2026-10-04). The fields are in `database.md#projects-model-project`. In short:

| Field | Shown |
| --- | --- |
| `title`, `kind`, `summary`, `cover` | Index frame, case-study head, next-project band, home bands |
| `client`, `stack`, `liveUrl` | Case-study head, home bands |
| `role`, `startedAt`, `endedAt`, `repoUrl` | Case-study head (the year everywhere comes from `endedAt`, or `startedAt` while ongoing) |
| `overview`, `deliverables`, `story` | Case-study story rows |
| `screenshots` (≤ 15, desktop and phone combined) | Case-study gallery |

### Story HTML

- `story` is HTML per locale, stored **already sanitized** and rendered as-is with `dangerouslySetInnerHTML` (Ram's choice: no Markdown parsing at render time).
- **Sanitize on write, not on read.** The console's save action must allow only `h3`, `h4`, `p`, `ul`, `ol`, `li`, `a[href]`, `strong`, `em`, `code`, `pre`, `blockquote`, `table` (`thead`, `tbody`, `tr`, `th`, `td`), `img[src,alt]` and `hr`, and strip `<script>`, `style`, event attributes and `javascript:` URLs. That needs a sanitizer library, to be agreed when the console is built. Until then only `scripts/seed.mts` writes stories.
- Headings start at `h3` because the row heading above is an `h2`; an `h2` inside the story is styled like an `h3`.
- Styling is the `story-prose` utility in `globals.css`, from tokens only. Tables scroll inside their own box on phones.

## Images

- Covers and screenshots live in **Cloudflare R2**. Documents store the public URL with the pixel `width` and `height` (for `next/image` sizing and the justified rows) and `alt` per locale.
- `next.config.ts` allows remote images only under `R2_PUBLIC_URL` (`images.remotePatterns`). Set it in every environment that builds or serves project images.
- Screenshots keep their own aspect ratio and are never cropped in the gallery. Covers are 16:9 and `object-cover`.

## Rendering

- Both pages are static with `revalidate = 86400`, like the home page. The case study prerenders every published slug (`generateStaticParams`); a project published after the build renders on its first visit (`dynamicParams` stays `true`), and unknown or draft slugs 404.
- `generateMetadata` and the page share one database read through React `cache`.
- The index reads teaser fields only (`findPublishedProjectTeasers`), not the stories and screenshots.
- When the console exists, saving a project must revalidate `/portfolio`, that project's page, the page of the project before it (its next-project band), and the home page.

## SEO

- Metadata through `pageMetadata()` in `lib/seo/metadata.ts`: title, description, canonical, `en`/`ar`/`x-default` alternates and the Open Graph card (the cover on case studies). The home page doesn't use it yet; the SEO step moves it over.
- JSON-LD from `lib/seo/structured-data.ts`, rendered by `components/Reusable/seo/JsonLd`: `CollectionPage` with an `ItemList` on the index; `CreativeWork` and `BreadcrumbList` on each case study. The `creator`/`author` is a `Person` reference by `@id`; the full `Person` node belongs to the SEO step.
- All copy, the contents list and every link are in the server HTML; only the counter and buttons need JavaScript.

## Waiting on Ram

- Real content for **HISTORY game** and **Ramlyon**: role, overview, deliverables, story (EN + AR), start and end dates, cover and up to 15 screenshots in R2. The seed fills `TODO:` placeholders.
- `R2_PUBLIC_URL` for `.env` and the hosting environment.
- Arabic copy for both pages (drafted by Claude).
