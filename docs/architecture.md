# Architecture

The folder tree and the short rules are in `CLAUDE.md`. This doc covers what each layer may do, and why.

## Layers

| Layer | Lives in | May import | Must not |
| --- | --- | --- | --- |
| Page / layout | `app/[locale]/**` | components, domain functions, `lib/seo` | query the DB directly |
| Presentation | `components/**` | `ui/`, hooks, Jotai atoms, `cn()` | contain business rules or fetch data in Server Components except through a domain function |
| Domain functions | `lib/<domain>/index.ts` | queries, `lib/<domain>/types.ts`, other domains' functions | know about React, requests or forms |
| Mutation boundary | `lib/<domain>/actions.ts` (`'use server'`) | Zod schemas, domain functions | return non-serializable values (Mongoose docs, `Date` without intent, class instances) |
| Queries | `lib/db/<domain>.ts` | models, the DB connection | apply business rules; they only read and write |
| Models | `lib/db/models/*` | mongoose | be imported by client code |
| Validation | `lib/validations/*` | zod | import server-only code: these schemas run on both client and server |

## Why this shape

- **Read path (Server Component → domain → query):** pages stay thin, and the same domain function serves pages, actions and `generateMetadata`. Data never makes a client round-trip that it doesn't need.
- **Write path (Server Action → validate → domain → query):** one mutation boundary per domain is where authorization and validation happen, so they can't be skipped. The client form reuses the same `*ZSchema` for instant feedback, but **the server re-validates every time**.
- **Action results are plain serializable objects** (e.g. `{ ok: true, data } | { ok: false, error }`). The client turns them into UI feedback (Sonner toasts, field errors). Invalidation (`revalidatePath` / `revalidateTag`) happens inside the action after a successful write.
- **`app/api/`** is for callers outside the app (webhooks, third parties). Internal UI never calls its own API routes.

## Runtime notes

- Mongoose and nodemailer need the **Node.js runtime**. Any route, action or proxy logic that touches them cannot run on the Edge runtime.
- Cloudflare sits in front of the origin, so cache headers and `revalidate` choices must account for a CDN layer. See `decisions.md`.
- Next 16 renamed `middleware.ts` to `proxy.ts`. Read `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` before writing it.

## Naming

- Zod: `<thing>ZSchema` (`emailZSchema`, `contactZSchema`). Infer types with `z.infer<typeof contactZSchema>`.
- Mongoose: `<thing>Schema` plus a model guarded against hot-reload re-compilation (`mongoose.models.X || mongoose.model('X', xSchema)`).
- Jotai: atoms go in `lib/state/<domain>.ts`, and only for state that more than one component tree shares. Local state stays local.
