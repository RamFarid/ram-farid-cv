# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: freelance clients.** Founders and business owners looking for someone to build or rebuild a web app or site. They arrive from a referral, a social profile or a search, scan quickly, and decide whether to get in touch.
- **Secondary: hiring teams.** Recruiters and engineering managers checking skills, stack and shipped work. They should find the CV and the stack within seconds without the page being built around them.
- **Owner: Ram.** Runs the site's data from the private `/console` and from Telegram.

## Product Purpose

ramfarid.com is the personal site of Ram Farid, a full-stack JavaScript engineer in Cairo. It exists to turn a visitor into a conversation: the primary action is contacting Ram, and downloading the CV is the secondary one. Success means a qualified client sends a message, or a recruiter leaves with the CV.

## Positioning

A working engineer who ships real client work end to end with Next.js, React and Node.js, shown through live production projects and current, verifiable figures rather than claims. Bilingual from the first line (English and Arabic, RTL), which matters to clients in the region.

## Operating Context

- Contact flow: form → Cloudflare Turnstile → Server Action (Zod) → MongoDB → console Messages + Telegram notification.
- The contact section carries social links (GitHub, LinkedIn, WhatsApp, Instagram) alongside the form.
- One universal CV file in Cloudflare R2, replaceable from the console.
- Projects are created and ordered in the console; the public site reads them from MongoDB.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind 4 on design-system tokens only, next-intl with `/en` and `/ar`. English is the default; Arabic is built in the same change, never after.
- Host-portable (Vercel or VPS); Server Components by default, minimal client JS; SEO/AEO/GEO rules in `docs/seo.md`.
- Home page sections, from `docs/project.md`: Hero, About + stats, Skills, Services, Projects, Certifications, Contact. Order and weight per section are open.
- `/portfolio` and `/portfolio/[project_id]` exist in the plan but are out of scope until the home page ships.
- No 3D cube or face-based navigation.

## Brand Commitments

- Design system in `docs/design-system/` (mirrored from Claude Design, read-only here): dark first, one violet, dot grid, Readex Pro + JetBrains Mono, small radii. Logos in `public/brand/`.
- Voice: first person, plain and confident; no exclamation marks, emoji or buzzword stacks; sentence case. Western digits in both languages. Name in Arabic: رام فريد.
- Title: "full-stack JavaScript engineer" (never "front-end developer").

## Evidence on Hand

- **Figures:** experience since 2021-11-13, computed at runtime to one decimal; **16 clients**; project count derived from projects stored in the console. Never hard-coded.
- **Projects:** real client and production work only (no clones, to-do or tutorial apps). Two client projects are live; screenshots are available.
- **Photo:** a portrait of Ram is available.
- **Certifications:** available with issuer, date and verification links.
- **Absent:** no client testimonials. Don't invent any, or any metrics, logos or results.

## Product Principles

1. Contact is the goal; every section should earn the next scroll toward it, and the CV is always one click away.
2. Prove, don't claim: live projects, real figures and verifiable certificates carry the case.
3. English and Arabic are equal citizens; nothing ships in one language only.
4. Fast and indexable: content rendered on the server, answer-ready copy, no layout shift.

## Accessibility & Inclusion

WCAG AA contrast in both themes (defined in the design system), visible focus on every interactive element, `prefers-reduced-motion` respected, full RTL mirroring.
