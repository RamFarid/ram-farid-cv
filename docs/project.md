# Project: ramfarid.com, new era

This is a full rebuild of ramfarid.com with a new identity. Nothing from the old site carries over except the domain and the section approach. Confirmed with Ram on 2026-10-03.

## Identity

- **Ram Farid, full-stack JavaScript engineer** (no longer "front-end developer").
- **Experience started 2021-11-13.** "Years of experience" is **calculated at runtime** from that date with date-fns and shown to one decimal (4.9 on 2026-10-03). Never hard-code it.
- **Clients: 16.** The **projects** count comes from the projects stored through the console (only real client work; see below). It is never typed in by hand.

## Public site

These are the same sections as the old site, redesigned with `docs/design-system/`:

1. Hero
2. About + stats
3. Skills
4. Services
5. Projects
6. Certifications
7. Contact

There is no 3D cube or other face-based navigation. That idea is dropped, even though the design-system README still mentions cube motion.

**Projects policy:** show real client and production work only. Test and tutorial projects (clones, to-do apps, weather apps) aren't shown.

**Languages:** English and Arabic (RTL) are built together, never one after the other. next-intl negotiates the language (cookie, then `Accept-Language`), and **English is the default**.

**CV:** one universal file (not one per language), stored in **Cloudflare R2** and replaceable from the console.

## Console (`/console`)

This is Ram's private dashboard for controlling the site's data:

- **Projects:** create, edit, reorder, publish.
- **CV file:** upload or replace in R2.
- **Site text:** editable copy, where the pages need it. Which strings are editable gets decided page by page and recorded here.
- **Messages:** contact-form submissions.

## Contact flow

Contact form → Cloudflare Turnstile check → Server Action (Zod) → saved in MongoDB → shown in the console's Messages page → **Telegram notification** to the "Contact Notifications" group (the bot is a member). Built 2026-10-04 except the console page; contract in `contact.md`.

## Telegram

Telegram is used heavily, for **notifications and actions** (it's an operational surface, not just alerts). Bot updates arrive at a route under `app/api/` (outside callers are what `api/` is for). The exact actions are listed under Open questions.

## Infrastructure

- **Cloudflare** in front: DNS/CDN, Turnstile, and R2 for files.
- **MongoDB** (Mongoose) for data.
- **Hosting is undecided**, leaning about 30:70 Vercel vs a VPS with Coolify. Until it's decided, **stay portable**: Node runtime, no platform-only services (no Vercel Blob/KV/Edge Config), configuration only through env vars, and a build that also runs as `output: 'standalone'`.

## Console sign-in (decided 2026-10-03)

1. Ram requests a one-time code, which the Telegram bot sends to him.
2. The code is checked against an `Otp` Mongoose model (short-lived, single use).
3. A session cookie is issued, and the device is **trusted for 14 days**: no new code is needed on that device until it expires.

## Decided task by task

- **Telegram actions:** message actions first (on contact notifications). Others are defined when we implement each feature.
- **Editable site text:** chosen page by page as each page is built, and recorded under Console above.
