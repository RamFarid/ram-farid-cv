# Contact

The contact section, the form behind it, and the Telegram notification each message triggers. Built 2026-10-04 (home page steps 5 and 6). The overall flow is in `project.md#contact-flow`; the stored document is `ContactMsgs` in `database.md`.

## Flow

1. The visitor fills the form. The client checks it with `contactZSchema` and shows errors at once.
2. Turnstile runs invisibly and hands the form a token.
3. The form calls the Server Action `sendContactMessage(locale, formData)` (`lib/contact/actions.ts`).
4. The action re-validates with the same schema, verifies the token with Cloudflare, and saves the message (`lib/contact` → `lib/db/contact.ts` → `ContactMsgs`).
5. It returns `{ ok: true }`, and then, **after the response is sent** (`after()` from `next/server`), posts the Telegram notification.

## Validation

`src/lib/validations/contact.ts` is client-safe and used on both sides. The server's check is the one that counts.

| Field | Rule |
| --- | --- |
| `name` | Required, at most 100 characters. |
| `email` | Required, trimmed, lowercased, a valid email, at most 254 characters. |
| `phone` | Optional; empty becomes `undefined`. Must start with `+` or `00` and have 8–15 digits. The country code is required so the number works as a `wa.me` link. Stored as typed. |
| `message` | Required, 10 to 4,000 characters. |

- **Error messages are keys**, not text. Each Zod issue's message is a key of `Home.contact.errors`, translated where it's shown. Use `contactFieldErrors()` (first issue per field) and `checkContactField()` (one field) rather than reading issues directly.
- The form uses `noValidate`, so the browser's own bubbles never replace the translated messages. Inputs still carry `required`, `type`, `maxLength` and `autoComplete`.
- A flagged field is re-checked as the visitor types, so its message clears without another submit. Fields aren't checked before the first submit.
- On a failed submit, focus moves to the first invalid field.

## Turnstile

- **No wrapper library.** `components/Reusable/forms/Turnstile.tsx` loads `api.js?render=explicit` with `next/script` and calls `turnstile.render` / `remove` in an effect. The whole API we use is three calls; a package would be another dependency for that.
- **Options:** `appearance: 'interaction-only'` (invisible unless Cloudflare asks for a click), `size: 'flexible'`, `theme: 'dark'`, `language` = the page locale, `action: 'contact'`, and `response-field: false`. The form keeps the token in state and sends it as `cf-turnstile-response`.
- **Layout:** the widget is zero-height until Cloudflare shows it. `before-interactive-callback` / `after-interactive-callback` toggle its bottom margin, so there's no empty gap above the button.
- **Tokens are single use.** After any server reply, the form bumps `resetKey` and the widget renders afresh.
- **Submit without a token** (the check is still running) shows "Still checking…" instead of calling the server.
- **Server check:** `lib/turnstile` posts to `siteverify` with the secret, the token and the visitor's IP (`CF-Connecting-IP`, since Cloudflare is in front, else the first `X-Forwarded-For`). The outcome is one of:
  - `passed`;
  - `failed`: the visitor didn't pass, shown as `verification`;
  - `unavailable`: the secret is missing, it's a setup error code, or Cloudflare is unreachable. Shown as the generic "problem on my side" and logged.
- **Keys:**
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is public and inlined at build time, so a static build needs it.
  - `TURNSTILE_SECRET_KEY` stays on the server.
  - `.env.example` ships Cloudflare's always-pass test keys for local dev. `3x00000000000000000000FF` forces a visible challenge, which is useful for checking the layout.
  - **Real keys fail on localhost** with error 110200 ("domain not allowed"): a site key works only on the hostnames listed for its widget. Keep the real keys in `.env` and the test keys in `.env.development.local`, which only `next dev` loads and which overrides `.env`. Don't add `localhost` to the production widget's hostnames. (Found 2026-10-04.)

## Server Action

- **The locale is bound by the client** (`sendContactMessage(locale, formData)`), because `next/root-params` isn't available in Server Actions. The action validates it with `hasLocale`.
- **The order is cheapest first:** Zod, then Turnstile, then the database.
- **Result:** `ContactResult` (`lib/contact/types.ts`) is `{ ok: true }` or `{ ok: false, error: 'invalid' | 'verification' | 'unavailable', fieldErrors? }`. It's always plain and serializable, and exceptions never reach the client.
- **The form doesn't use `<form action>`.** React resets a form after every `<form action>` submission, including failed ones, which would wipe the visitor's message on a Turnstile or server error. `onSubmit` with `useTransition` calls the action directly instead. The cost is no progressive enhancement, but Turnstile needs JavaScript anyway.
- **Success** replaces the form with a confirmation that names the sender and the address the reply goes to, and moves focus to its heading. **Send another message** remounts an empty form. There's no Sonner toast: a lasting inline confirmation is clearer than a toast that disappears, and it saved adding Sonner for one message.
- **Not built yet:** rate limiting beyond Turnstile. The console's Messages page was built on 2026-10-04 (`console.md#messages`).

## Telegram notification

- **Config:** `src/lib/telegram/config.ts` reads `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CONTACT_CHAT_ID`. If either is unset, `notifyContactMessage` logs a warning and skips the notification; the message is still saved. `src/lib/telegram/index.ts` has `sendTelegramMessage` (HTML parse mode, link previews off, one row of URL buttons, 10s timeout) and `escapeTelegramHtml`.
- **Failures never reach the visitor.** The notification runs in `after()`, once the message is saved, and its errors are logged with the message id.
- **The message (English, for Ram):** a title, then Name, Email, Phone (when given) and Language as plain text, so Telegram makes the email and phone tappable. The message body follows in an expandable blockquote. Every value is HTML-escaped. A body longer than about 3,500 characters is cut, with a note that the full text is in the console (Telegram's limit is 4,096).
- **Buttons** (`decisions.md`, "Telegram contact notification: text plus two buttons"):
  - **WhatsApp**: `https://wa.me/<digits>`, only when a phone was given. Spaces, dashes and a leading `00` are stripped.
  - **Show in console**: `${siteUrl}/console/contact-msgs/<id>` (changed from `/console/messages/<id>` when the page was built, 2026-10-04). `siteUrl` comes from `lib/seo/site.ts`, because Telegram rejects `localhost` button URLs, so even dev notifications link to the production origin. Notifications sent before the change point at the old URL, which 404s.
- **Bot updates** (actions on notifications, console sign-in codes) need a webhook under `app/api/`. They aren't built yet.

## Channels

Every way to reach Ram, in `lib/profile` (`contactChannels`). Confirmed by Ram on 2026-10-04.

| Channel | Link | Kind | Footer |
| --- | --- | --- | --- |
| Email | `mailto:ram@ramfarid.com` | direct | yes |
| WhatsApp | `wa.me/201553706448` | direct | yes |
| Messenger | `m.me/ramfarid22` | direct | |
| GitHub | `github.com/RamFarid` | profile | yes |
| Facebook | `facebook.com/ramfarid22` | profile | |
| Instagram | `instagram.com/ramfarid22` | profile | |

- **Contact section:** every channel as a dark tile (`bg-violet-ink`, echoing the dark screenshot slab) in a two-column grid. Each tile has the channel's mark in a lilac chip, the channel's name, and the handle in mono (left-to-right in both languages). Direct channels come first. Chosen by Ram in a live session on 2026-10-04, single-tone lilac over per-channel colours. The icons are the real brand marks (`ChannelIcon`), from Simple Icons 16.33.0 (CC0), inlined as single-tone paths so they take the lilac. Email has no brand, so it gets an envelope drawn in the same filled style. Gmail's mark would be wrong for a custom-domain address.
- **Footer:** GitHub, Email and WhatsApp, under "Get in touch". These are the professional profile and the two direct lines; the personal social profiles stay in the contact section.
- **Links:**
  - Profiles open in a new tab with `rel="me"`; they become `Person.sameAs` in the SEO step.
  - WhatsApp and Messenger open in a new tab without `rel="me"`.
  - Email opens the visitor's mail app in the same tab.
- **Names:** channel names come from `Common.channels`. Only "Email" is translated; brand names stay in Latin script.
- **LinkedIn** isn't listed (it wasn't in Ram's list).

## Layout

The section sits on a violet field (`design-system.md#violet-fields`).

- **Desktop:** the heading and channels are on the start side (5 columns) and the form on the end side (7 columns).
- **Phones:** heading, then form, then channels, so the form isn't pushed below six rows of links.
- **Errors on violet** use the dark ink with an icon and a doubled border, never the coral red.
