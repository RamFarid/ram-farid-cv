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
| `starred` | A "Recommended" badge on the index frame, the All projects row and the case-study head |
| `client`, `stack`, `liveUrl` | Case-study head, home bands |
| `role`, `startedAt`, `endedAt`, `repoUrl` | Case-study head (the year everywhere comes from `endedAt`, or `startedAt` while ongoing) |
| `overview`, `deliverables`, `story` | Case-study story rows |
| `screenshots` (≤ 15, desktop and phone combined) | Case-study gallery |

### Story HTML

- `story` is HTML per locale, stored **already sanitized** and rendered as-is with `dangerouslySetInnerHTML` (Ram's choice: no Markdown parsing at render time). Ram writes Markdown (`storyMarkdown`); the console's save action turns it into this HTML.
- **Sanitize on write, not on read.** `storyHtml()` in `lib/projects/markdown.ts` (server only) runs one unified pipeline: `remark-parse` → `remark-gfm` (tables, strikethrough with `~~` only, task lists, autolinks, footnotes) → `remark-rehype` → `rehype-sanitize` → heading shift and image check → `rehype-stringify`.
- **Allow-list:** GitHub's sanitize schema narrowed to `h3`, `h4`, `p`, `br`, `hr`, `blockquote`, `pre`, `code`, `ul`, `ol`, `li`, `input` (disabled task-list checkboxes), `a[href]`, `strong`, `em`, `del`, `sup` and `section` (footnotes), `img[src,alt]`, and `table` (`thead`, `tbody`, `tr`, `th`, `td`). Links may be `http`, `https`, `mailto` or in-page; images must be `https` **and in our R2 bucket** (others are dropped). Raw HTML in the Markdown never reaches the sanitizer: `remark-rehype` drops it. Scripts, styles and event attributes can't survive.
- **Headings:** the story sits under an `h2` row heading, so `#` becomes `h3` and `##` and deeper become `h4`. The editor shows the same two sizes.
- Footnote labels are per locale ("Footnotes" / "الحواشي").
- Styling is the `story-prose` utility in `globals.css`, from tokens only (task-list checkboxes, `del`, `sup` and the footnotes block included). Tables scroll inside their own box on phones.

## Images

- Covers and screenshots live in **Cloudflare R2**. Documents store the public URL with the pixel `width` and `height` (for `next/image` sizing and the justified rows) and `alt` per locale.
- `next.config.ts` allows remote images only under `R2_PUBLIC_URL` (`images.remotePatterns`). Set it in every environment that builds or serves project images.
- Screenshots keep their own aspect ratio and are never cropped in the gallery. Covers are 16:9 and `object-cover`.

## Rendering

- Both pages are static with `revalidate = 86400`, like the home page. The case study prerenders every published slug (`generateStaticParams`); a project published after the build renders on its first visit (`dynamicParams` stays `true`), and unknown or draft slugs 404.
- `generateMetadata` and the page share one database read through React `cache`.
- The index reads teaser fields only (`findPublishedProjectTeasers`), not the stories and screenshots.
- Every console write that changes a project revalidates the home page, `/portfolio` and **every** case study (`revalidatePath('/[locale]/portfolio/[project_id]', 'page')`), in both locales, plus the console layout. Revalidating the whole route covers the previous project's next-project band and a slug change without tracking neighbours; with up to 15 projects that's cheap.

## SEO

- Metadata through `pageMetadata()` in `lib/seo/metadata.ts`: title, description, canonical, `en`/`ar`/`x-default` alternates and the Open Graph card (the cover on case studies). The home page doesn't use it yet; the SEO step moves it over.
- JSON-LD from `lib/seo/structured-data.ts`, rendered by `components/Reusable/seo/JsonLd`: `CollectionPage` with an `ItemList` on the index; `CreativeWork` and `BreadcrumbList` on each case study. The `creator`/`author` is a `Person` reference by `@id`; the full `Person` node belongs to the SEO step.
- All copy, the contents list and every link are in the server HTML; only the counter and buttons need JavaScript.

## Starred

`starred` marks a project Ram recommends seeing. It shows a "Recommended" badge (a star and the word, neutral ink and a hairline, so it reads on the violet field too) on the index frame, the All projects row and the case-study head. It **doesn't** change the order or what the home page shows: the home page's bands stay the first two published projects by order (`decisions.md`, 2026-10-04). Starred from the console index (one click, saved at once) or the edit page.

## Stack

- `lib/projects/stack.ts` is the static list of tools a project can name: 89 entries, each with an id, display name, group (language, front end, styling, back end, data, hosting and infrastructure, services, tooling), brand colour and logo path. Projects store ids.
- **Logos** are the single-path 24×24 marks from [Simple Icons](https://simpleicons.org) (CC0), copied into the file; no icon package is installed. Regenerate or extend by copying the `path` and `hex` from Simple Icons' `icons/<slug>.svg` and `data/simple-icons.json`.
- **Colours:** each logo draws in its brand colour (Ram's call; the one exception to the one-violet rule). A brand colour under 2.5:1 against `surface` (black or near-black marks: Next.js, Vercel, GitHub, Express, Prisma and others) is stored as `color: null` and draws in the tag's text colour. A tool Simple Icons doesn't carry (Jotai, Zustand, next-intl, Nodemailer, AWS) gets a two-letter mono monogram.
- `StackTag` (`components/Reusable/projects/StackTag.tsx`) renders a tool as a `Tag` with its logo. Inside a violet field it becomes a dark chip (`violet-ink` ground, `violet-fill` text), so brand colours stay readable on violet. An id that isn't in the config renders as plain text.
- **Adding a tool is a code change on purpose**: the list is static content. The console's picker says so when a search finds nothing.
- The light theme isn't shipped; when it is, check the brand colours that are light (JavaScript yellow) against its ground.

## Console

`/[locale]/console/portfolio` and `/[locale]/console/portfolio/[project_id]`, built 2026-10-04 (phase 3 of `console.md#phases`). Surface brief: `.impeccable/surfaces/src-app-locale-console-app-portfolio-page-tsx.md`.

### Index

- Every project, drafts too, in console `order`, as ruled rows: grip handle, 16:9 cover thumbnail (or the title's initial), the title (page locale, falling back to English) with its status badge and Recommended mark, the slug and kind · year in mono.
- **Quick actions save at once** with a toast: star, Publish / Unpublish, View on the site (published), Delete (drafts only, behind an inline second click; deletes the project's R2 images too), and Edit.
- **Reorder** by the grip (drag, or ArrowUp / ArrowDown on the focused handle). `SortableList`'s `onCommit` fires when a drag ends or a key moves a row; the index waits 600ms for the list to settle and saves the whole order in one write (`reorderProjectList`).
- **Publishing an incomplete project** is refused: the toast names what's missing ("Title (Arabic), Cover, … and 4 more") with an Open action to the edit page.
- **New project** asks only for the English title. The slug is made from it (`slugify`, numbered when taken), the draft goes to the end of the list and its edit page opens.

### Edit page

- `project_id` is the database id, not the slug, so the console address survives a slug change. Unknown or malformed ids 404.
- **One draft for the whole project** (`useSectionDraft` under the key `project`): edits stay local, Discard returns to what is saved, the rail shows the unsaved dot on Projects and the browser's leave-page prompt guards reloads and rail links.
- **Sticky bar:** back to Projects, the title, the status badge, the unsaved state, Discard, then:
  - **Draft:** Save draft (primary while dirty) and Publish (primary when clean; "Save and publish" while dirty, which saves and publishes in one write).
  - **Published:** Unpublish (keeps local edits), View on site (when clean) and Save.
- **Sections** (anchored in the rail under Projects): Details (title, kind, client, address, summary, live and source links, Recommended), Dates and stack (start, end or empty for ongoing, the stack picker), Cover and gallery (16:9 cover with its description, up to 15 screens), Case study (role, overview, deliverables, the story editor).
- **Gallery:** several uploads at once (drop or choose). A portrait image is guessed to be a phone screen. Each screen has its device, description (alt) and optional caption, and moves by its grip.
- **Stack picker:** the chosen tools first (click to remove), then the catalogue by group with a search; at most 16, shown in the order picked.
- **Slug:** editing a published project's slug warns that the old address stops working.

### Validation and saving

- Schemas: `lib/validations/project.ts`. `projectDraftZSchema` needs only a valid slug and the English title (plus limits and URL/date formats). `projectPublishZSchema` needs every case-study field in both languages, the start date, at least one tool and one deliverable, and the cover with its description; captions stay optional. Both check that the end date isn't before the start.
- **A published project stays complete:** its saves are checked with the publish schema, on the page and in the action. To save work in progress on a live project, unpublish it first.
- The action (`lib/projects/actions.ts`) checks the session, parses, then `saveProject()` (`lib/projects/console.ts`) checks what the schema can't (the slug is free, every image is in our bucket), turns both stories into HTML, writes everything with one `$set`, and returns the images the project no longer uses; those are deleted from R2 in `after()`. Story images count: an image removed from the Markdown is deleted too.
- Errors come back keyed by dotted path (`screenshots.2.alt.ar`) with `Console.errors` keys, including `taken` (slug) and `beforeStart` (end date).
- Uploads go to the R2 folders `projects/covers`, `projects/screens` and `projects/story` (`lib/storage/actions.ts`), through the shared browser helper `uploadImage()` (`lib/storage/upload.ts`).

## Story editor

`components/Console/Markdown/`: a multi-language Markdown field with Obsidian-style live preview, built on CodeMirror 6.

- **Live preview** (`livePreview.ts`, a state field because table widgets replace whole lines): headings at the case study's `h3`/`h4` sizes, bold, italic, strikethrough, inline code, links, quotes, bullets, numbered lists, task checkboxes, fenced code (mono box, left to right in both languages), images (rendered from their URL), rules and tables (rendered as a table). Markers hide unless the caret is on that line (block marks) or inside that element (inline marks); clicking a rendered image, rule, checkbox or table puts the caret in its Markdown. Raw HTML is struck through, because saving drops it. Styles: `.md-editor` in `globals.css`, from the `story-prose` tokens.
- **Dialect:** CommonMark + GFM (`@lezer/markdown`'s `GFM`), the same one `remark-gfm` saves; no sub/superscript or emoji shortcodes, so what's styled is what's saved. Footnotes aren't styled in the editor but are saved.
- **Toolbar:** heading, subheading, bold (Ctrl+B), italic (Ctrl+I), strikethrough, inline code, link (Ctrl+K), bullets, numbers, checklist, quote, code block, table, divider, and image upload (to R2, inserted as `![Describe the image](url)` with the alt text selected). Enter continues lists and quotes.
- **Languages:** the same locale-code switch as `LocalizedField` (`components/ui/LocaleSwitch.tsx`, shared). Each language keeps its own editor state, so undo never crosses languages; Arabic is right to left.
- CodeMirror loads with the field (`import('./editor')`), so only the edit page pays for it.
- **Rejected:** a split source/preview pane and Write/Preview tabs (Ram chose in-place preview); `codemirror-markdown-hybrid` (pulls in mermaid, KaTeX and marked, one maintainer); Milkdown Crepe (a ProseMirror word processor that pulls in Vue and rewrites the Markdown on save); TipTap (Markdown is a lossy export); `@uiw/react-codemirror` (a wrapper we don't need).

## Waiting on Ram

- Real content for **HISTORY game** and **Ramlyon**, now enterable from the console: role, overview, deliverables, story (EN + AR), dates, stack, cover and screenshots. They're published with `TODO:` placeholders, and a published project only saves once it's complete, so either fill everything in one sitting or unpublish them while working.
- `R2_PUBLIC_URL` for the hosting environment, and `https://ramfarid.com` in the bucket's CORS rule before the console runs in production (only `http://localhost:3000` is allowed today).
- Arabic copy for both pages and the console (drafted by Claude).
