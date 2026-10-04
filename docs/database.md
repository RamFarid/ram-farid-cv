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

Real client and production work only (`project.md`). Created, ordered and published from the console; seeded until the console exists. Case-study fields added 2026-10-04 with `/portfolio` (`portfolio.md#case-study-content`).

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string, unique, lowercase | Becomes the `/portfolio/[project_id]` segment. |
| `title`, `client`, `kind`, `summary` | localized, required | `summary` is one sentence: what it is and who it's for. `kind` is e.g. "Web app". |
| `stack` | string[] | Tech names exactly as their projects write them ("Next.js", "MongoDB"). |
| `liveUrl` | string, optional | |
| `repoUrl` | string, optional | Only for public repos; most client repos are private. |
| `cover` | `{ url, width, height, alt: localized }`, optional | 16:9 screenshot in R2. Width and height are stored for `next/image`. |
| `startedAt`, `endedAt` | Date, optional | The timeline and duration on the case study. The year shown everywhere is `endedAt`'s, or `startedAt`'s while `endedAt` is unset (ongoing). Replaced the `year` field on 2026-10-04. |
| `role`, `overview` | localized, optional | `role` is short ("Sole full-stack engineer"). `overview` is plain text; blank lines split paragraphs. |
| `deliverables` | `{ en: string[], ar: string[] }`, optional | |
| `story` | localized HTML, optional | Stored sanitized, rendered as-is. Rules: `portfolio.md#story-html`. |
| `screenshots` | `{ url, width, height, device, alt: localized, caption?: localized }[]`, `device` is `desktop` or `mobile` | At most 15 in total (`MAX_PROJECT_SCREENSHOTS`, a schema validator). In R2; any aspect ratio. |
| `status` | `draft` \| `published` | Default `draft`. Only `published` is ever public. |
| `order` | number | Ascending; set by console reorder. |
| `createdAt`, `updatedAt` | timestamps | |

**Reads use `.lean()`, which skips schema defaults.** A document saved before a field existed comes back without it, even when the schema has `default: []`. Domain mappers in `lib/projects` fall back explicitly (`record.screenshots ?? []`). Do the same for every field added later. (The real-data build caught this on 2026-10-04.)

The case-study fields are optional in the schema so a draft can be saved incomplete; publishing will require them in the console's Zod schema, and the public pages hide a row whose field is empty.

Index: `{ status, order }` for the published reads (the home page's first two, the portfolio, the next project after a given `order`). There is no `featured` flag: removed 2026-10-04, because the home page shows the first two by order, not a hand-picked set. The site's "projects" figure is the count of `published` projects; it is never typed by hand.

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

### `HomeContents` (model `HomeContent`)

One document: the home page's editable content, edited from the console section by section (`console.md#home-content`). Lengths and counts are enforced by `lib/validations/home.ts`, not the model.

| Field | Type | Notes |
| --- | --- | --- |
| `about` | `{ title, body: localized, clientCount: number, portrait?: image }` | `body` is plain text; blank lines split paragraphs and `{clients}` becomes the client count. |
| `services` | `{ id, title, body: localized }[]` | In display order. |
| `skillGroups` | `{ id, name: localized, items: string[], practices: { id, label: localized }[] }[]` | `items` are tech names, the same in both languages. |
| `certifications` | `{ id, name, issuer, issuedOn?, description: localized, skills: string[], image?: image }[]` | `name` and `issuer` as issued; `issuedOn` is `YYYY-MM`. |
| `createdAt`, `updatedAt` | timestamps | |

- `image` is `{ url, width, height }`: the public R2 URL and pixel size, like project images.
- List items carry a string `id` made in the console (no Mongo `_id`), so React keys and field-error paths stay stable across saves.
- Order is array order; there's no `order` field.
- Saves replace one section with `$set` on `findOneAndUpdate({}, …, { upsert: true })`.

### `Otps` (model `Otp`)

Console sign-in codes (`console.md#sign-in`). `codeHash` (SHA-256 of the code), `attempts`, `expiresAt`, timestamps. At most one row: a new code deletes the others. TTL index on `expiresAt`.

### `Sessions` (model `Session`)

Trusted console devices. `tokenHash` (SHA-256 of the cookie's token, unique), `userAgent`, `expiresAt` (14 days after sign-in), timestamps. TTL index on `expiresAt`. Deleting a row signs that device out.

## Seeding

`npm run db:seed` runs `scripts/seed.mts` with tsx (`--env-file=.env`). It inserts the two live client projects, **HISTORY game** and **Ramlyon**, as `published`, in order 1 and 2, and the `HomeContents` document with the home copy as it stood in `messages` and `lib/profile` when the console took it over (certificates start empty: the old rows were placeholders). Each `HomeContents` section is filled only while it's missing.

- Upserts by `slug` with `$setOnInsert`, so re-running never overwrites a project edited since.
- On a project that already exists, fields added to the schema later are filled one at a time, only where the field is missing (`{ field: { $exists: false } }`). Added 2026-10-04 for the case-study fields.
- The copy is placeholder: fields prefixed `TODO:` need Ram's real content (client, kind, summary, role, overview, deliverables, story). Stack, live URL, dates, cover and screenshots are left unset until the real ones exist.
- tsx was chosen over Node's own type stripping because it resolves the `@/*` alias and extensionless imports the app code uses.
