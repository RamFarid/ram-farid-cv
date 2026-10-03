# Decisions

Newest first. Each entry gives the decision, why it was made, and what it constrains. When a decision is reversed, mark the old entry *Superseded* and link the new one; don't delete it.

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
- **Status:** as of this date only Next, React, Tailwind, clsx and tailwind-merge (for `cn()`) are installed. Add each library when the first feature needs it.
- **Constrains:** no overlapping libraries (no other state, validation, icon or toast libraries) without asking.

## 2026-10-03: Zod vs Mongoose naming

- **Decision:** Zod schemas are named `*ZSchema`. `*Schema` means a Mongoose schema.
- **Why:** both libraries call their objects "schemas". The suffix tells at a glance which side of the boundary a schema belongs to.

## 2026-10-03: `docs/` as shared memory

- **Decision:** `docs/` holds architecture, feature contracts and decisions for every human and AI contributor. `CLAUDE.md` stays a short rule sheet.
- **Why:** sessions and agents don't share context; the repo does.
