# CV

The CV behind every **Download CV** button is generated from the site's own content, not uploaded. Built with Ram on 2026-10-05; it replaced the PDF upload of 2026-10-04 (`decisions.md`).

One universal CV, in **English only** (`project.md`): one file serves both languages of the site.

## How it works

1. **Sources:** the home page's experience roles, skill groups and certificates (`HomeContents`), every project (drafts included), and the fixed facts in `lib/profile`: contact channels, location, education, languages, career start.
2. **Setup:** what the CV takes from those sources and how it reads, edited at `/console/cv` and stored as `cv` on the single `Profiles` document (`database.md#profiles`).
3. **Build:** `buildCvDocument(config, sources)` in `lib/cv` resolves both into a `CvDocument`. Every fact is final English text at this point. `renderCvPdf` in `lib/cv/pdf.tsx` lays it out with `@react-pdf/renderer` and returns the bytes and the page count.
4. **Serve:** `GET /api/cv` renders the saved setup and answers `application/pdf` with `Content-Disposition: attachment; filename="Ram-Farid-CV.pdf"`. Every Download CV button is a plain link to it (not the locale-aware `Link`, because `/api` sits outside `[locale]`).

The public route and the console's one-time download share every step. Only the setup they start from differs.

## Setup

The Zod contract is `cvConfigZSchema` (`lib/validations/cv.ts`). Limits are in `cvLimits`.

| Field | What it controls |
| --- | --- |
| `headline` | The line under the name (Ram's text, e.g. "Full Stack Engineer"). Required. |
| `tools` | Up to 6 tools joined with `\|` under the headline. |
| `summary` | The opening paragraph(s), written for the CV only. `{years}` becomes Ram's whole years of experience, so "{years}+ years" reads "4+" in 2026 and can't go stale. A blank line starts a paragraph. Empty drops the section. |
| `contacts` | Which of location, phone, email, website (`ramfarid.com`), LinkedIn and GitHub show, always in that order. The values come from `lib/profile` and `lib/seo/site`. |
| `sections` | The order and visibility of the eight sections under the header: Professional Summary, Technical Skills, Professional Experience, Additional Experience, Selected Projects, Certifications, Education, Languages. A section with nothing in it is left out whatever its setting. |
| `experience` | One row per home-page role: `tier` is `main` (Professional Experience), `additional` (Additional Experience) or `hidden`, plus the highlight ids left off. The CV lists roles **newest first**, by start date, with no manual order. |
| `projects` | Up to 8 projects in hand-set order, each with an optional CV name (empty uses the project's English title), up to 3 links written out, and **up to 5 CV-only bullets**. The case study's deliverables are not used: they're short labels for the case-study page, not CV sentences. |
| `skills` | The skill groups on the CV, in hand-set order, each with an optional label and the tools and practices left off. |
| `certifications` | Certificate ids, in order. |
| `pageSize` | `A4` or `LETTER`. |

- **Defaults favour new content.** A role missing from the setup counts as main with every highlight shown. A highlight, tool or practice added later shows by default, because the setup stores what's *left off*, not what's kept.
- **Stale references are dropped on read** (`normalizeCvConfig`): deleted roles, projects, groups, highlights and certificates disappear from the setup without a migration. The sections list always holds all eight.
- **Drafts can be picked** for Selected Projects: the CV links the live product, not the case study.
- **Seed:** `npm run db:seed` fills the setup once, from Ram's last hand-made CV (2026-10-05), while `cv` is missing.

## ATS

Ram's rule (2026-10-05): the CV must be ATS-compatible. Applicant tracking systems read a PDF's text layer in drawing order. Everything in `pdf.tsx` serves that:

- **One column in reading order.** The only side-by-side element is an entry's dates, drawn after its heading. There are no tables, text boxes, columns, images or icons.
- **Real text in a standard font.** Helvetica is a PDF standard font: nothing is embedded or subset, and its text extracts exactly in every reader. It covers Latin-1, which the English CV needs. Characters outside it (Arabic, emoji) don't render, so the setup's text must stay English.
- **No hyphenation.** react-pdf hyphenates by default, which would split keywords ("Type-Script") in the extracted text. `Font.registerHyphenationCallback` turns it off.
- **Plain, standard headings** in capitals, and nothing important in page headers or footers.
- **Links written out** (`linkedin.com/in/ramfarid`), because parsers read text, not link annotations. They're clickable as well.
- **Dates** as `May 2026 – Present`, the same format everywhere.
- **Metadata:** title "Ram Farid CV", author, subject (the headline), keywords (the tools and skill items) and `language="en"`.
- **Pagination:** a section heading moves with its first item, and an entry's heading moves with its first line, so neither ends a page alone.
- **Check after changing the layout:** `pdftotext` on the file must read top to bottom in the right order, with no hyphenated words and no missing characters.

## Console

`/console/cv` is its own manager in the rail (Home page, CV, Messages, Projects), with anchors for its six groups: Header, Summary, Experience, Projects, Skills, Sections and file. The whole page is **one draft** (`useSectionDraft('cv', …)`). Its sticky bar holds:

- **Save** (`saveCv` in `lib/cv/actions.ts`): checks the session and `cvConfigZSchema`, lines the setup up with today's content, renders it once (a setup that can't become a PDF never goes live), then stores it. The next `/api/cv` request serves it.
- **Download one-time** (`downloadOneTimeCv`): builds a PDF from the draft as it stands, saved or not, for one application. It **stores nothing and purges nothing**, so the public CV is untouched. The "Company" field names the file only (`Ram-Farid-CV-Acme-Corp.pdf`, via `cvFileName`) and is never saved. The action returns the bytes, and the page downloads them and reports the page count.
- **Discard**, as everywhere in the console.

Projects and skill groups are added with `OptionPicker`, a combobox that filters as you type, and reordered with `SortableList`. Experience roles are placed with a Professional / Additional / Hidden switch. The roles themselves are edited on the home page (`console.md#experience`).

## Caching

Not built yet: Ram moved it into the SEO/AEO/GEO turn (2026-10-05). Until then `/api/cv` is `force-dynamic` and renders on every request (about 10 KB, a few hundred milliseconds).

The plan for that turn:

- Cache the response for **7 days**.
- **Purge it on every save that changes the CV.** That means the CV page's Save, but also the experience, skills and certificate sections on the console's home page and project saves, because the CV reads them all.
- A one-time download never purges.

## Not built

- An Arabic CV.
- A live preview inside the console. Download one-time doubles as the preview.
- A stable short link such as `/cv`.

## Rejected

- **Keeping the PDF upload as a fallback** (Ram, 2026-10-05: "clear it, fully purge it"). The upload code, its R2 folder (`cv/`) and the old `cv` file record are gone.
- **A headless browser** (Puppeteer or Playwright) printing an HTML page: heavy, hard to run on serverless, and hosting is still undecided (`decisions.md`). react-pdf is plain JavaScript and in Next's built-in server-external list.
- **Embedding the brand fonts:** the site ships variable WOFF2 files, which react-pdf can't read. Static TTFs would add files, and an embedded subset font extracts less reliably than a standard one.
- **Reusing project deliverables as CV bullets** (Ram chose CV-only bullets).
