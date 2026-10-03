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

- Work on `new-era` and commit locally after each task.
- **Never push** until Ram asks.
- `origin` (`RamFarid/ram-farid-cv`) still holds the old site on `master`, `nextjs` and `nextjs1.0`. Never touch those branches.

## Commands

```bash
npm run dev          # dev server on http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve the production build
npm run lint         # ESLint (flat config: next core-web-vitals + typescript)
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
| Class names | `cn()` = clsx + tailwind-merge, in `src/utils/index.ts` (Ram provides the implementation; use it, don't rewrite it) |
| Toasts | Sonner |
| Email | nodemailer |

Use these and don't add an overlapping library without asking. Install each one when the first feature needs it.

## Naming: `*ZSchema` vs `*Schema`

- `*ZSchema` is a **Zod** schema: `emailZSchema = z.string()...`, `contactZSchema = z.object({...})`.
- `*Schema` is reserved for **Mongoose** schemas. The model guards against re-compilation on hot reload:

```ts
const otpSchema = new mongoose.Schema({ ... })
export const Otp = mongoose.models.Otps || mongoose.model('Otps', otpSchema)
```

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
  proxy.ts                    # request routing, if needed (Next 16 renamed middleware.ts to proxy.ts)
messages/                     # next-intl: one bundle per language
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

## SEO, AEO, GEO

Search, answer-engine and AI-search readiness is part of building every page, not a final pass. Follow `docs/seo.md` and keep `lib/seo/` as the single source of URLs, metadata and JSON-LD. The finished site gets audited with the `seo-geo-aeo` skill.

## UI

The visual source of truth is `docs/design-system/` (`README.md` brand book, `tokens.json`, component guidelines, fonts and logos). It was pulled from Ram's Claude Design system and is mirrored, not edited, here; see `docs/design-system.md`.

- Build every UI from its tokens, never from raw hex values or ad-hoc spacing.
- Dark is the default theme.
- Every layout must work in RTL: use logical properties and Tailwind's `ps-`/`pe-`/`ms-`/`me-`/`start-`/`end-` utilities.
