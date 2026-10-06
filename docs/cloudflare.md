# Cloudflare

Cloudflare runs DNS for `ramfarid.com`, proxies the apex and `www` to Vercel, serves R2 at `cdn.ramfarid.com` and runs Turnstile (`contact.md#turnstile`). Mail is Zoho (MX, SPF, DKIM `zmail._domainkey`).

The zone is configured in the dashboard, not in code. **This doc is the record of how it is set:** change a setting, update its row here.

## Settings (as of 2026-10-06)

| Setting | Value | Why |
| --- | --- | --- |
| AI bot policy (*AI Crawl Control*) | Search: allow. Agent: allow. Training: **disallow** (pending Ram's call, see below). Bot Preference Sync: on. | Search and agent bots fetch pages to answer a user right now. |
| Email Address Obfuscation | Off | Visible to crawlers and answer engines. The HTML matches what React hydrates. |
| Browser Cache TTL | Respect Existing Headers | The origin already sends the right `Cache-Control` for every route (`seo.md#caching`). |
| Cache rule `cdn.ramfarid.com` | Eligible for cache. Edge TTL: 1 year, ignoring the origin. Browser TTL: 1 year, overriding the origin. | R2 keys are never overwritten (a new key per upload; the seed never overwrites). It also covers uploads made before the header fix in `console.md#uploads`. A deleted object can stay at the edge; purge its URL by hand if it must vanish. |
| HSTS at Cloudflare | Off | Vercel already sends `Strict-Transport-Security: max-age=63072000` (2 years) on the apex and `www`. A second policy would duplicate it. |
| SSL/TLS | Full (strict), Always Use HTTPS, minimum TLS 1.2 | 1.0 and 1.1 are deprecated (RFC 8996). A 1.3-only floor would turn away some older clients and crawlers, and every modern client negotiates 1.3 anyway. |
| DMARC | `v=DMARC1; p=none; rua=mailto:dmarc@ramfarid.com; ruf=mailto:dmarc@ramfarid.com; sp=none; adkim=r; aspf=r` | Monitoring only. `dmarc@` must be a Zoho mailbox or alias. Move to `p=quarantine` once the reports show only Zoho sending. |
| Crawler Hints | On | IndexNow pings to Bing and Yandex. |
| Bot Fight Mode | Off | On Free, no rule can exempt traffic from it, and Turnstile already guards the form. |
| Turnstile | Production widget lists `ramfarid.com` | `localhost` uses the test keys in `.env.example`. |
| Rate limiting | None (Ram, 2026-10-06) | Not needed (checked 2026-10-06). Every console action checks the session first. The contact form needs a fresh single-use Turnstile token per message. Sign-in has one live code for the whole site, burned after 5 wrong guesses and re-issued at most once a minute, so guessing is capped at 5 a minute however many IPs try, and every new code pings Ram on Telegram. Pages, the CV, the sitemap and the social cards are served from cache. A per-IP limit adds nothing to these, and floods are covered by Cloudflare's and Vercel's automatic DDoS protection. |
| Rocket Loader, Mirage, Web Analytics | Off | Rocket Loader rewrites script tags and breaks React. |
| Managed `robots.txt` | Off | `/robots.txt` is `app/robots.ts`. Bot Preference Sync may prepend Cloudflare's lines, which must agree with the bot policy. |

Later: disallow the R2 bucket's `r2.dev` subdomain, so files are served only through `cdn.ramfarid.com`.

### AI training crawlers

The *Training* category holds `GPTBot`, `ClaudeBot`, `CCBot`, `Amazonbot`, `Bytespider` and similar crawlers, and it is disallowed today. They get a 403 from Cloudflare.

- **Disallowing them doesn't cut the site from answer engines.** Their search and user-fetch bots are in the allowed categories and get 200: `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`.
- **What it does cost:** models learn less about Ram from their training data, so they need a live search to answer "who is Ram Farid".

## Caching layers

- **Edge TTL** is how long Cloudflare keeps its copy before asking the origin again. A purge clears it.
- **Browser TTL** is the `Cache-Control` Cloudflare sends to the visitor, which is how long the browser reuses its copy without asking anyone. Nothing can purge it, so only immutable files get a long one.
- The zone-wide *Browser Cache TTL* setting is the default browser TTL for every response, and a cache rule overrides it for what the rule matches.
- With no rule, Cloudflare caches only its default static file extensions (`js`, `css`, images, fonts, `ico`, `txt`, …), never HTML, and follows the origin's `Cache-Control`. That is how `/_next/static/*` gets its year at the edge: Next.js names those files by content hash and sends `immutable, 1 year`.

## HTML stays uncached at the edge on Vercel

Decided 2026-10-06 (`decisions.md`):

- Vercel already serves the pages from its own ISR cache (`x-vercel-cache: HIT`).
- A second cache at Cloudflare would not be purged by `revalidatePath`, so a console save would stay invisible until Cloudflare's TTL ran out.
- Cloudflare also ignores `Vary: rsc`, which is risky for App Router responses.

If hosting moves to a VPS (Coolify), Cloudflare becomes the only CDN. Then:

- HTML caching needs a cache rule for the page paths.
- Every `revalidatePath` needs a Cloudflare purge-by-URL call next to it.
- RSC requests (`_rsc` query, `RSC` header) must stay out of the HTML cache key.
- Cached responses must set no cookie. next-intl sets `NEXT_LOCALE` when `Accept-Language` is missing or differs from the URL's locale, and Cloudflare won't cache a response that sets a cookie.
- HSTS moves to Cloudflare or the app, since the Vercel header goes away.
