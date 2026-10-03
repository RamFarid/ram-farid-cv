# Database

MongoDB through Mongoose 9. Layer rules (who may query, who may import models) are in `architecture.md`; this doc covers the connection, naming, and each collection's contract.

## Connection

- `src/lib/db/connect.ts` exports `connectDB()`. Every query function awaits it first.
- `MONGO_URI` comes from `.env` (template: `.env.example`, committed). It's validated with Zod on first connect, not at import, so a build that never touches the DB doesn't need it.
- The connection promise is cached on `globalThis`, so dev hot reloads and warm serverless instances reuse one pool. A failed connect clears the cache so the next call retries.
- `bufferCommands: false`: a query issued before the connection is up fails immediately instead of hanging.
- The file imports `server-only`, so a client import fails the build.
- **Local dev:** the MongoDB 7.0 Windows service on `127.0.0.1:27017`, database `ramfarid`. Starting the service needs an elevated shell (`net start MongoDB`).

## Naming

- **Model:** singular, capitalized (`Project`, `ContactMsg`, `Otp`).
- **Collection:** plural, capitalized, **always passed as the third argument** to `mongoose.model()`. Without it, Mongoose lowercases and pluralizes the model name (`contactmsgs`).
- **Schema:** `<thing>Schema` (Mongoose). `<thing>ZSchema` is Zod.
- The model export is guarded against re-compilation on hot reload and typed from the schema:

```ts
export type ContactMsgRecord = InferSchemaType<typeof contactMsgSchema>
export const ContactMsg: Model<ContactMsgRecord> =
  (mongoose.models.ContactMsg as Model<ContactMsgRecord> | undefined) ??
  mongoose.model('ContactMsg', contactMsgSchema, 'ContactMsgs')
```

- Keep the `: Model<…Record>` annotation on the export. Without it the export's type is a union of two model types, and TypeScript can't resolve `find()` and its filter (found 2026-10-03 with the first query).

- Models import nothing server-only, so Node scripts (`scripts/`) can use them directly. The rule that client code never imports them is enforced by the layers: only `lib/db/<domain>.ts` queries import models, and those go through `connect.ts`.

## Localized fields

User-facing text is stored once per locale as `{ en, ar }`, both required (`localizedString()` in `models/localized.ts`).

- It's a **required sub-schema**, not a nested path. With a nested path, Mongoose's inferred type makes the whole object optional (`{ en, ar } | null | undefined`) even when both keys are required.
- Brand and product names stay in Latin script in both locales (brand book: "Arabic copy"), e.g. `title: { en: 'Ramlyon', ar: 'Ramlyon' }`.
- Rejected: one document per locale, which duplicates the non-text fields and lets them drift. Also rejected: a separate translations collection, which needs a join for every read on a two-locale site.

## Collections

### `Projects` (model `Project`)

Real client and production work only (`project.md`). Created, ordered and published from the console; seeded until the console exists. The schema may change once `/portfolio` is designed.

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string, unique, lowercase | Becomes the `/portfolio/[project_id]` segment. |
| `title`, `client`, `kind`, `summary` | localized, required | `summary` is one sentence: what it is and who it's for. `kind` is e.g. "Web app". |
| `year` | number, optional | |
| `stack` | string[] | Tech names exactly as their projects write them ("Next.js", "MongoDB"). |
| `liveUrl` | string, optional | |
| `cover` | `{ url, width, height, alt: localized }`, optional | 16:9 screenshot. Width and height are stored for `next/image`. |
| `status` | `draft` \| `published` | Default `draft`. Only `published` is ever public. |
| `order` | number | Ascending; set by console reorder. |
| `createdAt`, `updatedAt` | timestamps | |

Index: `{ status, order }` for the home page read (the first two published by `order`). There is no `featured` flag: removed 2026-10-04, because the home page shows the first two by order, not a hand-picked set. The site's "projects" figure is the count of `published` projects; it is never typed by hand.

### `ContactMsgs` (model `ContactMsg`)

One document per contact-form submission. The full flow is in `project.md#contact-flow`.

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `email`, `message` | string, required | Email is lowercased. Length and format limits live in the contact Zod schema; the model stores what passed it. |
| `phone` | string, optional | Optional in the form. When present, the Telegram notification gets a WhatsApp button. |
| `locale` | `en` \| `ar` | The site language the visitor wrote from. |
| `status` | `new` \| `read` \| `archived` | Default `new`; changed from the console. |
| `createdAt`, `updatedAt` | timestamps | |

Index: `{ status, createdAt: -1 }` for the console inbox.

## Seeding

`npm run db:seed` runs `scripts/seed.mts` with tsx (`--env-file=.env`). It inserts the two live client projects, **HISTORY game** and **Ramlyon**, as `published`, in order 1 and 2.

- Upserts by `slug` with `$setOnInsert`, so re-running never overwrites a project edited since.
- The copy is placeholder: fields prefixed `TODO:` need Ram's real content (client, kind, summary, stack, live URL, cover).
- tsx was chosen over Node's own type stripping because it resolves the `@/*` alias and extensionless imports the app code uses.
