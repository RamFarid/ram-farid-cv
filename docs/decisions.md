# Decisions

Newest first. Each entry gives the decision, why it was made, and what it constrains. When a decision is reversed, mark the old entry *Superseded* and link the new one; don't delete it.

## 2026-10-03: Telegram contact notification: text plus two buttons

- **Decision:** the contact notification shows the sender's email and phone as plain message text (Telegram makes both tappable). The only inline buttons are **WhatsApp** (`https://wa.me/<number>`, only when a phone was given) and **Show in console**.
- **Why:** Telegram inline-button URLs accept only `http(s)://` and `tg://`, so `mailto:` and `tel:` buttons aren't possible. Ram chose plain text over workarounds (Gmail compose links, redirects through the site).
- **Details:** built in the Telegram step; config in `src/lib/telegram/config.ts`, secrets in `.env`.

## 2026-10-03: Mongoose naming and localized fields

- **Decision:** models are singular and capitalized (`ContactMsg`); collections are plural and capitalized (`ContactMsgs`) and always passed explicitly to `mongoose.model()`. User-facing text fields are a required `{ en, ar }` sub-schema.
- **Why:** Ram's convention; without the explicit name, Mongoose lowercases and pluralizes it. One document holding both locales keeps non-text fields from drifting between languages.
- **Details:** `database.md`.

## 2026-10-03: Home page: work first, in project bands

- **Decision:** the home page leads with the work. A short intro strip (one heading, Start a project as the primary action, Download CV as the secondary), then one full-width band per featured project (the first on a violet field, the second on `surface`). Then About + stats, Services, Skills, Certifications, and Contact on a violet field. Violet fills whole regions, as the design system's Cover blocks do.
- **Why:** clients first, recruiters second; the two live projects are the strongest proof. Chosen by Ram over a letter-style page, a stats-led hero, a block mosaic and a split hero.
- **Constrains:** on violet fields, text, tags and the focus ring use `on-primary`, never `primary-ink` or the default violet ring. `/portfolio` is out of scope until the home page ships. Product context is in `PRODUCT.md`.

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
- **Status:** as of this date only Next, React, Tailwind, clsx and tailwind-merge (for `cn()`) are installed. Add each library when the first feature needs it. Added 2026-10-03 with the data foundation: Mongoose, Zod, `server-only`, and tsx (dev, for `scripts/`).
- **Constrains:** no overlapping libraries (no other state, validation, icon or toast libraries) without asking.

## 2026-10-03: Zod vs Mongoose naming

- **Decision:** Zod schemas are named `*ZSchema`. `*Schema` means a Mongoose schema.
- **Why:** both libraries call their objects "schemas". The suffix tells at a glance which side of the boundary a schema belongs to.

## 2026-10-03: `docs/` as shared memory

- **Decision:** `docs/` holds architecture, feature contracts and decisions for every human and AI contributor. `CLAUDE.md` stays a short rule sheet.
- **Why:** sessions and agents don't share context; the repo does.
