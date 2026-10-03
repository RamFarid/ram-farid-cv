# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## `docs/` is the project memory

`docs/` is the long-term memory for this repo, shared by every session and every AI agent. Read `docs/README.md` first; it indexes everything else. `docs/project.md` defines what we're building: the public site plus the private `/console` dashboard.

- Before building something, read the docs for that domain. If no doc covers what you need, ask; don't guess.
- After building something, document it in the same change: the technical contract, the approach chosen, rejected alternatives and why, constraints future work must respect. Use `docs/<domain>/**` for rich domains and `docs/<domain>.md` for short ones, and add a dated entry to `docs/decisions.md` for any choice that steers future work.
- Keep this file short and stable. Put rules here and put detail and rationale in `docs/`.

## Git

- Work on `new-era`. **Don't commit** until Ram says to; leave changes in the working tree.
- **Never push** until Ram asks.
- `origin` (`RamFarid/ram-farid-cv`) still holds the old site on `master`, `nextjs` and `nextjs1.0`. Never touch those branches.

## Commands

```bash
npm run dev          # dev server on http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve the production build
npm run lint         # ESLint (flat config: next core-web-vitals + typescript)
npm run db:seed      # insert the live projects (needs MONGO_URI in .env; never overwrites)
npx next typegen && npx tsc --noEmit   # type-check only (typegen creates the global LayoutProps/PageProps types)
```

No test runner is configured yet. If you add one, document it here.

## Stack

Next.js 16 (App Router, React Compiler enabled in `next.config.ts`), React 19, TypeScript strict, and Tailwind CSS 4 (CSS-first config in `src/app/globals.css`, no `tailwind.config`). Import alias: `@/*` → `src/*`.

| Concern | Choice |
| --- | --- |
| Edge / CDN | Cloudflare in front of the site; Turnstile on public forms |
| File storage | Cloudflare R2 |
| Notifications / ops | Telegram bot |
| Hosting | Undecided (Vercel or VPS + Coolify): keep everything portable, see `docs/decisions.md` |
| Validation | Zod |
| Database | MongoDB via Mongoose |
| Client state | Jotai |
| Dates | date-fns |
| i18n | next-intl (English + Arabic/RTL) |
| Icons | lucide-react |
| Class names | `cn()` = clsx + tailwind-merge, in `src/utils/index.ts` (Ram provides the implementation; use it, don't rewrite it). Its tailwind-merge knows the design-system token names: add new text, spacing or shadow tokens there too |
| Toasts | Sonner |
| Email | nodemailer |

Use these and don't add an overlapping library without asking. Install each one when the first feature needs it.

## Naming: `*ZSchema` vs `*Schema`

- `*ZSchema` is a **Zod** schema: `emailZSchema = z.string()...`, `contactZSchema = z.object({...})`.
- `*Schema` is reserved for **Mongoose** schemas.
- Models are **singular, capitalized** (`Otp`, `ContactMsg`); collections are **plural, capitalized** (`Otps`, `ContactMsgs`) and always passed explicitly, because Mongoose otherwise lowercases and pluralizes the name itself. The model guards against re-compilation on hot reload:

```ts
const otpSchema = new mongoose.Schema({ ... })
export const Otp: Model<OtpRecord> =
  (mongoose.models.Otp as Model<OtpRecord> | undefined) ?? mongoose.model('Otp', otpSchema, 'Otps')
```

Details: `docs/database.md`.

## File organization

```text
src/
  app/
    [locale]/                 # all pages, per next-intl routing
    api/                      # real HTTP endpoints only (webhooks, external callers)
    globals.css
  components/
    ui/                       # reusable, app-owned primitives
    Reusable/<domain>/        # shared compositions
    <Page>/                   # page-specific presentation
  hooks/                      # React hooks
  contexts/                   # React providers/context, where appropriate
  lib/
    <domain>/
      types.ts                # domain contracts
      index.ts                # domain functions (business logic), when useful
      actions.ts              # mutation boundary: 'use server'
    validations/              # shared, client-safe Zod schemas
    db/
      models/                 # Mongoose models
      <domain>.ts             # per-domain queries
    seo/                      # URL, metadata and structured-data policy
    state/<domain>.ts         # Jotai atoms, only where shared state is needed
    common.types.ts           # genuinely cross-domain types only
  i18n/                       # next-intl routing / request / navigation glue
  utils/index.ts              # cn()
  fonts/                      # woff2 files + next/font/local definitions
  proxy.ts                    # request routing, if needed (Next 16 renamed middleware.ts to proxy.ts)
messages/                     # next-intl: one bundle per language
scripts/                      # one-off Node scripts (tsx), e.g. the DB seed
docs/                         # project memory (see above)
```

## Data flow

Keep each layer to its own job. Components never call the database, and queries contain no business rules.

- **Read:** Server Component → domain function (`lib/<domain>/index.ts`) → query (`lib/db/<domain>.ts`) → MongoDB.
- **Write:** client form → Server Action (`lib/<domain>/actions.ts`) → Zod validation + authorization → domain function → query → a serializable result, plus revalidation/invalidation.
- Use `app/api/` only when something outside the app has to call over HTTP. Internal mutations go through Server Actions.

## Comments

Write a comment only when it is necessary or semi-necessary. That means:

- the *why* behind something non-obvious;
- a reference to the doc that explains the decision (`// See docs/contact.md#rate-limiting`);
- a link to an external spec or API that the code follows;
- a short note above a function or component when its contract isn't clear from its signature.

Comments can sit above a function, a component or a single statement. Never write comments that repeat what the code says.

## i18n (next-intl)

English (default) and Arabic (RTL), always built together. Full contract: `docs/i18n.md`.

- Every user-facing string lives in `messages/en.json` **and** `messages/ar.json`, changed in the same edit. Type-checking fails if their keys drift apart.
- Import `Link`, `redirect`, `usePathname` and `useRouter` from `@/i18n/navigation`, never from `next/link` or `next/navigation`.
- Use logical layout utilities only (`ps-`, `me-`, `start-`, `text-start`), so layouts mirror in RTL.

## SEO, AEO, GEO

Search, answer-engine and AI-search readiness is part of building every page, not a final pass. Follow `docs/seo.md` and keep `lib/seo/` as the single source of URLs, metadata and JSON-LD. The finished site gets audited with the `seo-geo-aeo` skill.

## UI

The visual source of truth is `docs/design-system/` (`README.md` brand book, `tokens.json`, component guidelines, fonts and logos). It was pulled from Ram's Claude Design system and is mirrored, not edited, here; see `docs/design-system.md`.

- Build every UI from its tokens, never from raw hex values or ad-hoc spacing.
- Tokens are CSS variables and Tailwind utilities in `src/app/globals.css`. Tailwind's default palette and type scale are removed, so use `bg-surface`, `text-ink-muted`, `text-h2`, `p-space-5` and so on. The utility map is in `docs/design-system.md#tokens`.
- Dark is the default theme.
