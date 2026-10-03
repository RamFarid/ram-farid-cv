# Project docs

This folder is the long-term memory for ramfarid.com. Every session and every AI agent that works on the repo reads it before building and updates it after. `CLAUDE.md` at the repo root holds the short rules; this folder holds the detail and the reasons behind them.

## Index

| Doc | What it covers |
| --- | --- |
| [project.md](project.md) | What we're building: identity, site sections, `/console`, contact + Telegram flow, infrastructure |
| [home.md](home.md) | Home page plan: audience, section structure, constraints, build steps and their status |
| [contact.md](contact.md) | Contact form, validation, Turnstile, the Server Action, Telegram notification, contact channels |
| [i18n.md](i18n.md) | next-intl routing, messages, RTL, digits, not-found behaviour |
| [seo.md](seo.md) | SEO / AEO / GEO rules every public page follows, and site-wide files |
| [architecture.md](architecture.md) | Layer contracts, data flow, server/client boundaries, naming |
| [database.md](database.md) | MongoDB connection, model/collection naming, localized fields, collection contracts, seeding |
| [decisions.md](decisions.md) | Dated log of choices that steer future work |
| [design-system.md](design-system.md) | Where the design system comes from, how to re-sync it, how it maps to code |
| [design-system/](design-system/) | Mirror of the Claude Design system: brand book, tokens, components, fonts, logos |

## How to write a doc here

- **One domain per doc:** `docs/<domain>.md` when the domain is short; `docs/<domain>/` with an `index.md` when it's rich (contracts, flows, edge cases).
- **Record the contract, not a tour of the code:** inputs and outputs, invariants, the approach chosen and the alternatives rejected, limits, and open questions. Don't list files that a search would find.
- **Date the entries.** Write absolute dates (`2026-10-03`), never "yesterday" or "last sprint".
- **Link from code when it helps:** `// See docs/<domain>.md#<section>` above the code a decision governs.
- **Add the doc to the index above** when you create it.
