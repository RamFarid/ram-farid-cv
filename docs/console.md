# Console: `/[locale]/console`

Ram's private dashboard. Shaped with Ram and phase 1 built on 2026-10-04. The decisions that steer later work are in `decisions.md` ("Console: bilingual, section-by-section saves, Telegram sign-in"); the surface brief is `.impeccable/surfaces/src-app-locale-console-page-tsx.md`.

## Phases

| # | Phase | Routes | Status |
| --- | --- | --- | --- |
| 1 | Sign-in, and the home page's content | `/console`, `/console/sign-in` | Done 2026-10-04 |
| 2 | Contact messages | `/console/contact-msgs`, `/console/contact-msgs/[msg_id]` | Done 2026-10-04 |
| 3 | Projects and the portfolio | `/console/portfolio`, `/console/portfolio/[project_id]` | Placeholder page; next |

The CV upload and the availability toggle are expected to join the main page later (not built).

## Routing and locales

- The console is bilingual, like the site: `/en/console` and `/ar/console`, full RTL, every string in both `messages` bundles (`Console`, `LocalizedField`, `TagInput`). This settled the open question in `i18n.md`; the proxy and root layout are unchanged.
- `app/[locale]/console/layout.tsx` sets `robots: noindex, nofollow` and the title template for everything below it (`seo.md`).
- `(app)/` is a route group for the signed-in pages; its layout checks the session and renders the rail. `sign-in/` sits outside it.
- All console pages are dynamic (they read the session cookie).

## Sign-in

1. **Request:** `sendSignInCode()` makes a six-digit code with `crypto.randomInt`, stores only its SHA-256 in `Otps` with a 5-minute expiry, deletes any earlier code, and sends it to the **"Ram OTPs"** Telegram group (`TELEGRAM_OTP_CHAT_ID`). A new code can be asked for once a minute.
2. **Verify:** `signIn(locale, code)` compares hashes with `timingSafeEqual`. Five wrong guesses burn the code. A right code is deleted before the session is made, and only the request that actually deletes it signs in, so a code works once even under a race.
3. **Session:** a random 32-byte token goes in the `console_session` cookie (httpOnly, `SameSite=Lax`, `Secure` in production, path `/`, expires in **14 days**). `Sessions` stores only the token's SHA-256 with the expiry; a TTL index cleans up expired rows. Deleting a row signs that device out. There is no sliding renewal: the device is trusted for 14 days from sign-in, then needs a new code.
4. **Notice:** after each sign-in, the bot posts "New console sign-in" with the device's user agent to the **"Ram Ownership"** group (`TELEGRAM_OWNER_CHAT_ID`, optional).
5. **Checks:** `requireSession(locale)` (pages; redirects to sign-in) and `getSession()` (actions; returns `unauthorized`) in `lib/auth/session.ts`, deduped per request with React `cache`. Every console page and every console Server Action calls one of them; the layout check alone isn't a security boundary.
6. **Sign out:** deletes the session row and the cookie.

- **No session secret.** The cookie is an opaque random token looked up in the database, not a signed payload, so there's nothing to sign. Rejected: a signed/encrypted cookie (JWT or similar), which needs a secret and can't be revoked without a deny list.
- **Who can sign in:** anyone who can read the "Ram OTPs" group. Keep that group to Ram.
- Telegram chats were identified on 2026-10-04 with the bot's `getChat`: "Ram Host" is the contact group (`TELEGRAM_CONTACT_CHAT_ID`), "Ram OTPs" gets codes, "Ram Ownership" gets owner notices.

## Layout

- **Rail** (start side, sticky, full height from `lg`): the brand with a "Console" badge; Home page, Messages (with the count of `new` messages) and Projects (published · drafts); on the home page, the four section anchors in home-page order (02 About to 05 Certifications), the current one in ink and a warning dot on each section with unsaved edits; then View site, the language switch and Sign out.
- **Under `lg`** the rail is a top block that wraps: the brand, the three managers, a scrolling row of the section anchors (with the unsaved dots), then View site, language and Sign out.
- **Order:** Home page is a peer of Messages and Projects, with its anchors nested under it, so the rail reads the same on every console page.
- **Main column:** up to 1200px. The h1 and a one-line lead, then one panel per section.

## Home content

One `HomeContents` document (model `HomeContent`), edited section by section. The public home page reads it through `getHomeContent(locale)` (React `cache`), the console through `getConsoleHomeContent()`. The schema and limits are `lib/validations/home.ts` (shared by the forms and the actions). Before the console, this copy lived in `messages/*.json` and `lib/profile`; the seed moved it on 2026-10-04.

### About

- **Heading** and **Paragraphs**, both multi-language. Blank lines split paragraphs.
- `{clients}` inside the paragraphs becomes the client count, formatted per locale on the page. An insert chip on the field puts it at the caret. Ram confirmed only the client count is a placeholder: "November 2021" is written as text, because the career start is fixed.
- **Client count:** a typed number (0 to 9999).
- **Live client projects** and **years of client work** are shown read-only: published projects counted from `Projects`, years computed from `careerStart` in `lib/profile`.
- **Portrait:** an R2 image, `object-cover` in the 4:5 frame. Without one, the public page keeps the monogram.

### Services

Ordered rows of title → description, both multi-language. At most 12. An empty list hides the section on the home page.

### Skills

Ordered groups, at most 16. Each has a multi-language **name**, **tools** (tech names as mono tags, the same in both languages, at most 40) and **practices** (each multi-language, at most 12; set in the sans on the page). A group needs at least one tool or practice. Rejected: tags only (practices as Latin tags), which would have put English words on the Arabic page.

### Certifications

Ordered, at most 24. Each has an image (R2, `object-contain` on a 4:3 mat), name and issuer (as issued, not translated), issue month (`YYYY-MM`, optional), a multi-language description and at most four skill tags. Without an image, the public page shows the issuer's initials and no viewer.

## Saving

- Each section saves on its own: its Server Action (`lib/home/actions.ts`) checks the session, parses with the section's Zod schema, checks that image URLs are in our bucket, replaces that section with `$set` (upserting the document), then calls `revalidatePath('/[locale]', 'page')` (both locales of the home page) and `revalidatePath('/[locale]/console', 'page')`.
- Result: `{ ok: true }` or `{ ok: false, error: 'unauthorized' | 'invalid' | 'unavailable', fieldErrors? }`. Field errors are keyed by dotted path (`services.2.title.ar`) and hold a key of `Console.errors`.
- **Drafts are local** (`useSectionDraft`): edits, reorders and removals change only the draft. **Discard** returns to what is live, so removing an item needs no confirm dialog. The section's dirty flag goes into a Jotai atom (`lib/state/console.ts`) for the rail's dots and the browser's leave-page prompt.
- **Validation:** Save checks the draft with the same schema first. After a failed attempt the draft is re-checked on every edit, so each message clears as its field is fixed.
- **The one violet control:** a section's Save is primary only while it has unsaved edits; a clean section's Save is a disabled secondary. Other actions (Discard, Add a practice, an image's Remove) use the neutral `quiet` button variant.
- **Leaving with unsaved edits:** the browser's `beforeunload` prompt covers reloads and closing the tab. Client-side navigation would skip it, so while any section is dirty the rail's links do a full-document navigation instead, which the prompt then guards.

## Messages

The inbox for contact-form submissions (`ContactMsgs`, `database.md`). Surface brief: `.impeccable/surfaces/src-app-locale-console-app-contact-msgs-page-tsx.md`.

- **Filters:** Inbox (everything not archived; the default), Unread (`new`) and Archived, each with its count. The filter is `?filter=` (left out for Inbox) and the open message is `/console/contact-msgs/[msg_id]`, so Telegram links, reloads and the back button all land on the same view.
- **Layout:** from `lg`, the list (24rem) on the start side and the open message, or a prompt to pick one, on the end side. Under `lg` the list page shows only the list and a message page only the message, with a back link that keeps the filter.
- **List:** newest first, at most 200 per filter. Each row: a warning dot and full-ink sender for unread ones, the relative time (the full date on hover), a two-line preview in the message's own direction, the visitor's language code, and a phone icon when a number was left.
- **Message:** sender, full date and time (Cairo time, `CONSOLE_TIME_ZONE`), the language the visitor wrote in, email and phone as links, then the message at reading measure with its line breaks kept and `dir="auto"`.
- **Actions:** **Reply by email** (the one primary; a `mailto:` with the subject in the visitor's language, "Your message on ramfarid.com"), **WhatsApp** when there's a phone, then Mark as read / unread, Archive / Move to inbox, and, only in the archive, **Delete** behind an inline second click. Delete is permanent and the query itself refuses a message that isn't archived.
- **Marking read:** opening a new message marks it read from the client after it renders (`MarkAsRead`), never as a side effect of the GET, so link previews and prefetches don't change data.
- **Revalidation:** every action calls `revalidatePath('/[locale]/console', 'layout')`, which refreshes the list, the counts and the rail's new-message count.
- **Telegram:** the notification's "Show in console" button opens `${siteUrl}/console/contact-msgs/<id>`; the proxy adds the locale.
- Not built: search, bulk actions, replying from inside the console, and Telegram buttons that file a message. Add them when the volume asks for it.

## Localized field

`components/ui/LocalizedField` is the reusable multi-language input (Ram, 2026-10-04).

- It shows one value at a time and starts on the page's locale.
- At its end, a mono locale code button (`EN`) opens a native popover (`popover="auto"`: Esc and outside clicks close it) listing the **other** languages, each marked filled, missing (warning) or needs a fix (danger). Picking one switches the value being edited and returns focus to the field. The field takes that language's `lang` and `dir`.
- The button carries a dot when another language is empty (warning) or has an error (danger).
- An error in the language not shown reads "Arabic: Fill this in." with a "Switch to Arabic" button.
- Single-line, or `multiline` with `rows`. `snippets` adds insert-at-caret buttons on the label row.
- It loops over `routing.locales`, so a third language needs no change to it.
- The popover is anchored to its button with CSS anchor positioning (`.locale-popover` in `globals.css`: below, aligned to the end edge, flipping above when there's no room). Without anchor positioning it stays centred in the viewport.

`components/ui/TagInput` is the companion for tech names: Enter or a comma adds a tag, Backspace in the empty input removes the last one, a pasted comma list adds them all, duplicates are ignored (case-insensitive), and the input is LTR in both languages.

## Lists

`components/Console/SortableList` orders services, skill groups and certificates. Each row has a grip handle: drag it with a pointer (the row follows the pointer and swaps with a neighbour when it crosses half of it), or focus it and press ArrowUp / ArrowDown (focus stays on the handle; a live region announces "moved to position 3 of 9"). No library. Practices inside a group aren't reorderable.

## Uploads

- `@aws-sdk/client-s3` with `@aws-sdk/s3-request-presigner` (Ram's choice over `aws4fetch` and over uploading through the server).
- `getImageUploadUrl({ folder, contentType, size })` checks the session and returns a **presigned PUT** valid for 5 minutes, with the content type and length signed, for a new key `<folder>/<uuid>.<ext>`. Folders: `home/portrait`, `home/certificates`. PNG, JPEG, WebP or AVIF, up to 8 MB.
- The browser reads the image's pixel size (`createImageBitmap`), PUTs the file straight to R2, then puts `{ url, width, height }` in the draft. Nothing is live until the section is saved.
- On save, images the section no longer uses are deleted from R2 after the response (`after()`). An upload that is never saved stays in R2; clean such orphans up by hand if they pile up.
- The client turns off the SDK's default CRC32 checksums (`WHEN_REQUIRED`), which would otherwise be signed into the URL and break browser PUTs (Cloudflare's R2 + SDK v3 guidance).
- **The bucket needs a CORS rule** allowing `PUT` with `Content-Type` from each origin that runs the console (`http://localhost:3000`, `https://ramfarid.com`), or browser uploads fail.
- Console previews use `next/image` with `unoptimized`, so a fresh upload shows even before `R2_PUBLIC_URL` is in the running server's `images.remotePatterns`. The public page uses the optimizer.

## Environment

`TELEGRAM_BOT_TOKEN`, `TELEGRAM_OTP_CHAT_ID` (sign-in is off without both), `TELEGRAM_OWNER_CHAT_ID` (optional), `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` (uploads are off without all five). Template: `.env.example`.

## Open

- Arabic console copy was drafted by Claude for Ram to review.
