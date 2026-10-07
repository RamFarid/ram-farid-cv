# Projects setup: writing a portfolio project, with screenshots

How each portfolio project gets its full case study and screenshots, so any session can pick up the next one without redoing the groundwork. Started 2026-10-07 with Ramlyon.

- **Field contract:** `portfolio.md#case-study-content`.
- **Folder format and the seed:** `database.md#case-studies-in-docsprojects`.
- **Why it works this way:** `decisions.md` (2026-10-07).

## Status

| Project | Slug | Source repo | Folder | State |
| --- | --- | --- | --- | --- |
| Ramlyon | `ramlyon` | `E:\projects\Next.js\ramlyon-v2` | `docs/projects/ramlyon/` | **Done.** README and 26 screenshots (15 in the gallery). Ram entered the live copy in the console on 2026-10-07. |
| HISTORY website | `history-game` | `E:\projects\Next.js\m2-game` (`m2history.com`) | `docs/projects/history-game/` | **Done** 2026-10-07: README, the logo cover, and 64 screenshots (15 in the gallery): 31 public, 33 signed in, plus 15 private. Order 2, end date open. Its README replaces the old inline `history-game` seed entry, which described the website and the wiki together (Ram split them on 2026-10-07). |
| HISTORY Wiki | `history-wiki` | `E:\projects\Next.js\matin2` (`wiki.m2history.com`) | `docs/projects/history-wiki/` | **Written** 2026-10-07: README, a new cover and 40 screenshots (15 in the gallery); order 3. Waiting on Ram's review and his questions in the README. |
| St Mary Maadi | `st-mary-maadi` | ask Ram | | To do |
| This CV site ("My New Era CV") | ask Ram | this repo | | To do |
| Ram's other projects (~16) | | | | Ram decides later which to add; some would weaken the portfolio. |

## Rules from Ram

- **Nothing is written to the database without telling Ram.** `.env`'s `MONGO_URI` may point at **production**. Never run `npm run db:seed` on your own.
- **The seed is idempotent and fill-only.** `docs/projects/` exists so a migration or a new database gets every case study and its screenshots. Live copy is entered and edited by Ram in the console; a README change never reaches a live project.
- **`docs/projects/` is git-ignored.** Never commit it; it may hold drafts and notes.
- **Ram reviews and filters the copy** directly in the README.
- **He's happy to publish real usage numbers** (traction). He filters them himself.
- **Screenshots:** many of them, covering every feature, even though the gallery shows 15 at most. Spares are kept for later.
- **Keep the logo cover** (the existing `scripts/seed-assets/covers/<slug>.webp`, copied to `assets/cover.webp`) unless Ram says otherwise.
  - When two projects share a brand (the HISTORY website and wiki), tell them apart with the product's own type. The wiki's cover is the HISTORY logo with "WIKI" in the wiki's League font, built as an HTML page and screenshotted at 1920×1080.
- **Stack:** list **every** tool the project used, up to 32. Add a missing tool to `lib/projects/stack.ts`:
  - the Simple Icons path and hex if it has one (the colour is `null` under 2.5:1 on `surface` `#131019`);
  - otherwise no path, which draws a monogram.
- **Dates:** the start date is the repo's **first commit** unless Ram gives one.

## The steps, per project

### 1. Research (read-only)

- **Read the source repo's docs first:** `CLAUDE.md`, `docs/`, any feature inventory or audit. Then:
  - `git log --format='%ad %h %s' --date=short` for dates and milestones;
  - `package.json` for the stack;
  - the schema for the models;
  - the routes (`find src/app -name page.tsx`).
- **Count real numbers from the code:** models, files and lines, permissions, locales, metrics, tests. Each one goes in the story's "By the numbers" table.
- **Keep only shipped work.** If the repo's docs mark something planned or partial, leave it out or state the limit.
- **Never claim** what you can't point to in code or docs.
- **Check the current code, not just the docs.** A repo's docs can describe work that was later reverted. The HISTORY website's security audit describes hardening that a launch-day revert removed: `git log` showed the revert and `src/` confirmed it. Grep `src/` for each feature you claim.

### 2. Run the app and get data into it

- **Public pages:** shoot the live production site when it's public and read-only. Never submit a form or place an order on production.
- **Signed-in areas (dashboards, admin, CMS):** run the source repo **locally** against its **local** database (`localhost` only), never a production login.
  - Ram gives the seed command and logins, or says where they are (the repo's seed and `.env.development.local`).
  - Re-seed the local database if Ram says so.
- **Empty screens make bad screenshots.** Write a **local-only** generator script in the source repo:
  - name it `scripts/_portfolio-*.mts`, keep it untracked, and delete it when done;
  - make it refuse any non-`localhost` `DATABASE_URL`;
  - give it realistic history (weeks of orders, visits, users, staff), using the app's own models and recompute jobs so derived numbers (analytics) are real;
  - for comparisons like "growth vs previous period", generate twice the range.
- **Time of day:**
  - Public pages that compute open or closed on the device: set the browser clock (`page.clock.install`).
  - Server-computed "today" in a signed-in area: temporarily set the local tenant's timezone to one where it's daytime now, run the browser in that `timezoneId`, and restore it afterwards.

### 3. Screenshots

- **Tool:** `playwright-core` installed in the session scratchpad, driving the bundled Chromium at `%LOCALAPPDATA%\ms-playwright\chromium-1243\chrome-win64\chrome.exe`.
  - Log in once and save `storageState` per role (owner, admin).
  - Git Bash rewrites `/paths` passed as arguments, so pass routes without the leading slash.
- **Sizes:**
  - Phone: 390×844 at 2× (780×1688), `isMobile` and `hasTouch` on.
  - Desktop: 1440×900 at 1.5× (2160×1350).
  - Dark colour scheme.
- **Frame the content, not the chrome:** when a site opens on a tall banner, scroll each page so its title or breadcrumb sits under the sticky header (the wiki: `nav[aria-label="breadcrumb"]`, about 110 px for item pages and 165 px for category pages, whose title sits above the breadcrumb). Check first whether the window or an inner container scrolls.
- **Scroll-in animations:** pass `reducedMotion: 'reduce'` to the browser context, or long pages capture as blank space. Then scroll to each section heading instead of taking one full-page shot.
- **`display: contents` wrappers have no box:** measure from a real element (the HISTORY website's tab buttons), not from its wrapper.
- **Signed-in areas with only a production database** (the HISTORY website: MongoDB Atlas and the live game MySQL): log in only with an account Ram names. On 2026-10-07 that was his own `ramfarid`. Then:
  - **Navigate only:** `page.goto` and screenshots; no clicks, no typing, no submits.
  - **Crop to the part that changes:** the content panel (`div.min-w-0 > section.panel` on the HISTORY website), or a fixed-width app's own frame (the shop), not the whole layout.
  - **Keep personal data out of the gallery:** any shot showing other people's usernames, emails, IPs, messages or payments, or live secrets such as redeem codes, goes to `assets/private/` and is never published.
- **Look for measured numbers in commit bodies too,** not only in docs: the HISTORY website's shop timings were in `git log` (`6465d50`, `5a47885`).
- **Phone shots only where the site has a phone layout.** The HISTORY Wiki renders its desktop shape on every screen (a 1280px viewport), so it has none.
- **No `rm` with a glob in a `cd`-prefixed command:** Claude Code's safety check blocks it. Write each round of shots to a fresh folder instead of clearing one.
- **Clean the frame before each shot:**
  - hide `nextjs-portal` (the dev badge), dev-only panels and transient banners, by text in every locale the shot uses;
  - wait for data and animations (3–6 s).
- **Cover everything:**
  - every feature screen, the public side and the signed-in side;
  - a dialog or editor open where that's the feature (variants, permissions, a designer);
  - at least one Arabic/RTL shot and one phone shot of the signed-in side;
  - the admin view when there is one, but **only with demo data**: no real customer, tenant, phone or payment details.
- **Review before keeping:** contact sheets (sharp, 2 columns), then a full-size look at the doubtful ones.
- **Save:** WebP q82 with sharp into `docs/projects/<slug>/assets/`, named `<screen>-<locale>[-phone].webp`.

### 4. Write `docs/projects/<slug>/README.md`

- **Format:** front matter, notes for Ram, then the `## field:` sections. Copy `docs/projects/ramlyon/README.md` as the template.
- **Fields:** title, client, kind, role, summary, cover alt, overview, deliverables (12 at most) and story, each in `en` and `ar`, plus the `screenshots` table (15 rows at most).
- **Limits** are in `projectLimits`:
  - summary 220 (aim for 155 or less, it doubles as the meta description);
  - alt 160 and caption 140;
  - deliverable 160 each;
  - overview 2000 and story 20000.
- **Story:**
  - `#` sections that each prove a decision: what was hard, what was chosen and the measured result;
  - then a "By the numbers" table;
  - Arabic written natively, not word for word.
- **Notes for Ram:**
  - sources;
  - how the screenshots were made, and anything simulated;
  - the alternates not in the gallery;
  - open questions;
  - bugs found in the source repo while shooting (reported there, not fixed).
- **Check it:**
  - The reader (`scripts/seed-projects.mts`) refuses a README that fails `projectPublishZSchema`. Check it without writing by calling `readProjectDocs()` from a scratch script.
  - `npx tsc --noEmit` and the build when code changed (e.g. new stack tools).

### 5. Hand over

- **Tell Ram:**
  - what's in the folder;
  - the gallery's 15 and the alternates;
  - what was simulated;
  - questions;
  - leftovers in the source repo (generator scripts, local data).
- **Update this file's status table.** Don't commit until Ram says to.
