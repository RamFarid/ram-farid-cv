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

Real client and production work only (`project.md`). Created, edited, ordered and published from the console (`portfolio.md#console`); the live projects were seeded first (`#seeding`). Case-study fields added 2026-10-04 with `/portfolio` (`portfolio.md#case-study-content`).

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | string, unique, lowercase | Becomes the `/portfolio/[project_id]` segment. |
| `title`, `client`, `kind`, `summary` | localized; a draft may leave values blank (`''`) | `summary` is one sentence: what it is and who it's for. `kind` is e.g. "Web app". |
| `stack` | string[] | Tool ids from `lib/projects/stack.ts` (`nextjs`, `mongodb`), in display order. An id that isn't in the config renders as plain text on the site and drops out in the console. |
| `starred` | boolean, default `false` | Shows a "Recommended" badge on the public pages; it doesn't change the order (`portfolio.md#starred`). |
| `liveUrl` | string, optional | |
| `repoUrl` | string, optional | Only for public repos; most client repos are private. |
| `cover` | `{ url, width, height, alt: localized }`, optional | 16:9 screenshot in R2. Width and height are stored for `next/image`. |
| `startedAt`, `endedAt` | Date, optional | The timeline and duration on the case study. The year shown everywhere is `endedAt`'s, or `startedAt`'s while `endedAt` is unset (ongoing). Replaced the `year` field on 2026-10-04. |
| `role`, `overview` | localized, blank in drafts | `role` is short ("Sole full-stack engineer"). `overview` is plain text; blank lines split paragraphs. |
| `deliverables` | `{ en: string[], ar: string[] }`, optional | |
| `storyMarkdown` | localized Markdown | What Ram writes in the console's story editor, kept so it can be edited again. |
| `story` | localized HTML | Made from `storyMarkdown` on every save, stored sanitized, rendered as-is. Rules: `portfolio.md#story-html`. |
| `screenshots` | `{ url, width, height, device, alt: localized, caption?: localized }[]`, `device` is `desktop` or `mobile` | At most 15 in total (`projectLimits.screenshots` in `lib/validations/project.ts`, also a schema validator). In R2; any aspect ratio. |
| `status` | `draft` \| `published` | Default `draft`. Only `published` is ever public. |
| `order` | number | Ascending; set by console reorder. |
| `createdAt`, `updatedAt` | timestamps | |

**Reads use `.lean()`, which skips schema defaults.** A document saved before a field existed comes back without it, even when the schema has `default: []`. Domain mappers in `lib/projects` fall back explicitly (`record.screenshots ?? []`). Do the same for every field added later. (The real-data build caught this on 2026-10-04.)

Localized fields use a draft sub-schema (both locales default to `''`), so a draft saves incomplete. Completeness is the console's job: `projectPublishZSchema` requires every case-study field in both languages before a project is published, and keeps requiring it while it stays published (`portfolio.md#console`). The public pages still hide a row whose field is empty.

Index: `{ status, order }` for the published reads (the home page's first two, the portfolio, the next project after a given `order`). There is no `featured` flag that picks the home page's projects (removed 2026-10-04: the home page shows the first two by order). `starred` came back the same day as a badge only, by Ram's request; it selects nothing. The site's "projects" figure is the count of `published` projects; it is never typed by hand.

### `ContactMsgs` (model `ContactMsg`)

One document per contact-form submission. The full flow is in `project.md#contact-flow`.

| Field | Type | Notes |
| --- | --- | --- |
| `name`, `email`, `message` | string, required | Email is lowercased. Length and format limits live in the contact Zod schema; the model stores what passed it. |
| `phone` | string, optional | Optional in the form. When present, the Telegram notification gets a WhatsApp button. |
| `locale` | `en` \| `ar` | The site language the visitor wrote from. |
| `status` | `new` \| `read` \| `archived` | Default `new`; changed from the console (`console.md#messages`). Only archived messages can be deleted. |
| `createdAt`, `updatedAt` | timestamps | |

Index: `{ status, createdAt: -1 }` for the console inbox.

### `HomeContents` (model `HomeContent`)

One document: the home page's editable content, edited from the console section by section (`console.md#home-content`). Lengths and counts are enforced by `lib/validations/home.ts`, not the model.

| Field | Type | Notes |
| --- | --- | --- |
| `about` | `{ title, body: localized, clientCount: number, portrait?: image }` | `body` is plain text; blank lines split paragraphs and `{clients}` becomes the client count. |
| `experience` | `{ id, role: localized, organization, url?, startedOn, endedOn?, summary: localized, highlights: { id, text: localized }[], projectId? }[]` | Timeline roles, saved oldest first. Dates are `YYYY-MM`; no `endedOn` means ongoing. `projectId` is a `Projects` `_id` as a string. Seeded 2026-10-05 from Ram's CV. |
| `services` | `{ id, title, body: localized }[]` | In display order. |
| `skillGroups` | `{ id, name: localized, items: string[], practices: { id, label: localized }[] }[]` | `items` are tech names, the same in both languages. |
| `certifications` | `{ id, name, issuer, issuedOn?, description: localized, skills: string[], image?: image }[]` | `name` and `issuer` as issued; `issuedOn` is `YYYY-MM`. |
| `createdAt`, `updatedAt` | timestamps | |

- `image` is `{ url, width, height }`: the public R2 URL and pixel size, like project images.
- List items carry a string `id` made in the console (no Mongo `_id`), so React keys and field-error paths stay stable across saves.
- Order is array order; there's no `order` field.
- Saves replace one section with `$set` on `findOneAndUpdate({}, …, { upsert: true })`.

### `Profiles` (model `Profile`)

One document: site-wide settings about Ram that the console manages. Facts that never change (career start, contact channels, education, languages) stay in `lib/profile` as code. Added 2026-10-04 for the CV upload; since 2026-10-05 it holds the CV builder's setup (`cv.md`).

| Field | Type | Notes |
| --- | --- | --- |
| `cv` | object, optional | The CV setup, as `cvConfigZSchema` (`cv.md#setup`): `headline`, `tools[]`, `summary`, `contacts[]`, `sections[] { id, visible }`, `experience[] { id, tier, hiddenHighlights[] }`, `projects[] { projectId, title, links[], bullets[] { id, text } }`, `skills[] { groupId, label, hiddenItems[], hiddenPractices[] }`, `certifications[]` (ids), `pageSize` (`A4` or `LETTER`). Unset means nothing is picked yet: the CV shows the facts from `lib/profile` only. |
| `createdAt`, `updatedAt` | timestamps | |

- `experience[].id`, `skills[].groupId` and `certifications[]` point into `HomeContents`; `projects[].projectId` is a `Projects` id. They aren't enforced: references whose target is gone are dropped on read (`normalizeCvConfig`).
- Saves replace `cv` with `$set` on `updateOne({}, …, { upsert: true })`.
- The old `cv: { url, name, size, uploadedAt }` file record (2026-10-04) was removed on 2026-10-05 with the upload.

### `Otps` (model `Otp`)

Console sign-in codes (`console.md#sign-in`). `codeHash` (SHA-256 of the code), `attempts`, `expiresAt`, timestamps. At most one row: a new code deletes the others. TTL index on `expiresAt`.

### `Sessions` (model `Session`)

Trusted console devices. `tokenHash` (SHA-256 of the cookie's token, unique), `userAgent`, `expiresAt` (14 days after sign-in), timestamps. TTL index on `expiresAt`. Deleting a row signs that device out.

## Seeding

`npm run db:seed` runs `scripts/seed.mts` with tsx (`--conditions=react-server --env-file=.env`). It writes everything the site needs to go live, and never overwrites real content:

- **Projects:** the three live client projects, **Ramlyon**, **HISTORY game** and **St Mary Maadi** (added 2026-10-06), as `published` and `starred`, in order 1 to 3, with full case studies in both languages: client, kind, summary, stack, live URL, role, overview, deliverables, story, dates (from Ram, 2026-10-06) and a cover. The copy comes from Ram's CV (`prompts/Ram_Farid_Full_Stack_Engineer_CV.docx`) and the live sites. Screenshots aren't seeded; they're uploaded from the console.
- **`HomeContents`:** the home copy as it stood in `messages` and `lib/profile` when the console took it over, the experience timeline from the CV, Ram's portrait, and his six Sololearn certificates (copied from the old ramfarid.com on 2026-10-06, name and month as printed).
- **`Profiles`:** the CV setup from Ram's last hand-made CV, only while `cv` is missing (`cv.md#setup`), with HISTORY and St Mary Maadi in Selected Projects and all six certificates.

### Seed images

- The images live in the repo under `scripts/seed-assets/` (covers, certificates, portrait) and go to R2 under **fixed keys** (`projects/covers/<slug>.webp`, `home/certificates/<id>.jpg`, the portrait's original console key) through `putImageOnce()` in `lib/storage`: a `HeadObject`, then a `PutObject` only when the key is empty. Re-running never duplicates, and a new bucket gets every image.
- The stored URL is `R2_PUBLIC_URL` + key, so each environment stores its own public origin (the `r2.dev` URL in dev, `https://cdn.ramfarid.com` in production) for the same bucket.
- Without the R2 variables the seed warns once and leaves the image fields unset.
- Covers (2026-10-06) are each client's logo from its live site, centred on its brand ground at 1920×1080: Ramlyon's red R on `#0C0C0D`, HISTORY's sword wordmark on `#100E0A`, St Mary's seal on `#F3ECDF`.
- **Dev and production share the bucket.** The console deletes images a save no longer uses (`portfolio.md#console`), so replacing a seeded cover or certificate from a dev console also deletes the object production shows. Replace seeded images from the production console.

### Re-running

- A new project is inserted with `$setOnInsert` (upsert by `slug`).
- On a project that already exists, a field is written only while it's **unfilled**: missing, `''`, `[]`, or still holding an earlier seed's `TODO:` placeholder. Localized fields are checked per locale, so an English value Ram wrote survives while a `TODO:` Arabic one is replaced. `status` and `order` always exist, so the seed never changes them on an existing project; `starred` is filled only on documents saved before the field existed. (Before 2026-10-06 only missing fields were filled, so the first seed's `TODO:` copy stayed forever.)
- Each `HomeContents` section is filled only while it's missing or an empty list (so the certificates reach a document that had `[]`), and `about.portrait` only while missing. A section emptied on purpose in the console comes back on the next seed.
- The CV setup gets St Mary Maadi and the certificates **once**, in the run that first adds them (the project inserted, the certificates filled), so taking them off the CV in the console sticks.
- The story HTML is made by `storyHtml()` (`lib/projects/markdown.ts`), the same pipeline the console's save runs. That module imports `server-only`, which throws outside a React Server environment; `--conditions=react-server` resolves it to its empty export, as Next.js does on the server.
- tsx was chosen over Node's own type stripping because it resolves the `@/*` alias and extensionless imports the app code uses.

Every seeded project, the About section, the certificates and the CV setup pass the console's own schemas (`projectPublishZSchema`, `aboutZSchema`, `certificationsZSchema`, `cvConfigZSchema`; checked 2026-10-06), so each one saves from the console as-is.
