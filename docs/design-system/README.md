The design system for **ramfarid.com** — the personal site of Ram Farid, a full-stack JavaScript developer in Cairo. The look is *technical and precise*: a near-black canvas, one violet (`primary`, #A25BFF), a dot grid, mono labels, small radii. It is bilingual — English and Arabic (RTL) — from the first component.

## Principles

1. **One violet.** `primary` is the only brand hue. Everything else is violet-tinted neutrals. Status colors appear only when something has a status.
2. **Precise, not cold.** Sharp hierarchy, a 4px spacing grid, mono for anything that is data (eyebrows, numbers, tech names, code) — and a warm, first-person voice on top.
3. **Readable in two scripts.** Every choice has to hold in English and Arabic: one type family covering both, logical CSS properties, and leading loose enough for Arabic marks.
4. **Dark first.** Design and review in the Dark theme; the Light theme must work, but it is the alternate.

## Content fundamentals

- **Voice:** first person, plain and confident. "I build fast, clear web apps" — not "Ram is a passionate developer who…". No exclamation marks, no emoji, no buzzword stacks.
- **Casing:** sentence case for headings, buttons and nav ("Selected projects", "Send message"). Eyebrows are the only uppercase, set by CSS, never typed in caps.
- **Tech names** are written as their projects write them: Next.js, React, Node.js, Express.js, MongoDB, PostgreSQL, MUI, Git, GitHub — and set in `Tag` or `code`.
- **Numbers:** Western digits (0–9) in both languages. Stats are real and current — check figures such as years of experience, client count and project count before every launch.
- **Arabic copy:** Modern Standard Arabic, written natively (not machine-literal). Keep product and tech names in Latin script inside Arabic sentences: "أعمل بـ Next.js وReact". Name: رام فريد.
- **Examples**
  - Hero: "Full-stack JavaScript developer in Cairo. I build fast, clear web apps with Next.js, React and Node."
  - CTA pair: primary "Hire me", secondary "View GitHub".
  - Error: "Enter an email like name@domain.com" — say what to do, not what went wrong.

## Color

- Page ground is `bg`; cards, nav and inputs sit on `surface`; hover and code blocks on `surface-raised`. Don't introduce other greys.
- Text is `ink` (primary) and `ink-muted` (secondary). Both read on `bg`, `surface`, `surface-raised` and `primary-soft` in both themes (≥4.5:1).
- `primary` is a **fill** colour: primary button, active indicators, focus ring, the logo's big R, cover blocks. Text on it is always `on-primary` (dark, 5.2:1) — never white, which is only 3.8:1 on #A25BFF.
- Violet **text** is `primary-ink` (links, eyebrows, highlighted words, stat units); in Light it darkens to #7A2EE0 so it still passes 4.5:1. Its tinted ground is `primary-soft`.
- Borders: `line` for decorative hairlines and card edges; `line-strong` for anything interactive (inputs, secondary buttons), which holds 3:1 on every surface.
- Status: `success` (teal, off the red–green axis), `warning`, `danger`, each with a `-soft` ground. Always pair with a word — color never carries a status alone.
- No gradients between hues, no blue-to-purple washes. The only "glow" is `shadow-glow`, one element at a time.

## Typography

- **Readex Pro** (sans) for everything — the Arabic-Latin extension of Lexend, a family designed around reading ease. It is loaded as two files: `Readex Pro` (Latin) and `Readex Pro Arabic` (Arabic); the `sans` stack lists both so each script picks its own glyphs automatically. Variable weight 160–700.
- **JetBrains Mono** (mono) for `eyebrow`, `code`, `numeral`, tags and project meta. Arabic inside mono falls back to Readex Pro Arabic.
- Scale: `display` 64 → `h1` 44 → `h2` 32 → `h3` 22 → `body-lg` 18 → `body` 16 → `small`/`label` 14 → `eyebrow` 12. Headings 500–600 with slight negative tracking; body 400 (300 for `body-lg`).
- On screens under 768px, step headings down one level (`display` uses `h1` size, `h1` uses `h2`).
- Arabic uses its own styles — `display-ar`, `h2-ar`, `body-ar` — with ~1.4–1.8 line-height. **Never letter-space Arabic** and never uppercase it; tracking breaks the joins.
- Paragraphs max out at `measure` (68ch).

## Layout & spacing

- Content sits in a `container` (1200px) with `space-4` gutters on mobile, `space-6` on desktop.
- Sections are separated by `space-9` (desktop) / `space-8` (mobile). Section title to content: `space-7`. Card padding: `space-5`; card grids gap `space-5`.
- Each section opens with a `SectionHeading`: eyebrow with an index ("01 / About"), `h2`, optional lead.
- **The pattern:** `.rf-grid-bg` — 1px dots in `line` at a `space-8` pitch. Use it behind the hero and the contact section only; never behind long text.
- Anchor targets get `scroll-margin-top: var(--nav-height)` plus `space-4`.

## Shape, borders, elevation

- Radii are small: `radius-sm` tags and badges, `radius-md` buttons and inputs, `radius-lg` cards and code blocks. `radius-full` only for status dots and the avatar.
- Separate with 1px borders first, shadows second. In Dark, `shadow-sm`/`shadow-md` are subtle; elevation reads through `surface` steps and borders.
- Hover on a linked card: border turns `primary`, `shadow-glow`, lift 2px.

## Motion

- Quick and functional: `duration-fast` for color changes, `duration-base` for lifts and menus, `duration-slow` for section reveals; `ease-out` by default, `ease-in-out` for the 3D cube rotation and face expand/collapse.
- Arrows in buttons and links nudge 3px toward their direction on hover.
- Respect `prefers-reduced-motion`: drop transforms and pulses; keep color changes.

## States & focus

- Focus: a solid 2px `focus` ring (alias of `primary`) at 2px offset, on every interactive element, both themes (≥3:1 on all surfaces). Never remove it; never replace it with a color change alone.
- Hover: secondary controls fill `surface-raised`; primary fills `primary-hover`.
- Disabled: 45% opacity, `not-allowed` cursor, no glow.
- Errors: `danger` border plus a message below the field in `danger`.

## Arabic & RTL

- Set `dir="rtl"` and `lang="ar"` on `<html>` for the Arabic site. Components use logical properties (`padding-inline`, `margin-inline-start`, `border-block-end`), so they mirror without overrides.
- Mirror directional icons (arrows, chevrons) — add the `.rf-flip` class; the built-in arrows already do. Don't mirror code, numbers, media controls or brand marks.
- Swap type styles: `display` → `display-ar`, `h2` → `h2-ar`, `body` → `body-ar`. Eyebrows in Arabic drop uppercase and tracking automatically.
- The language switch is a secondary `Button` in the nav labelled in the *other* language ("English" / "العربية").

## Iconography & imagery

- Icons: **Material Symbols Outlined** (weight 300, grade 0, optical size 20/24) — it matches the MUI stack and the thin, precise stroke of the type. Size 20px beside `label` text, 24px standalone. Color `ink-muted`, `ink` on hover, `primary-ink` when active. The arrows in the components are inline SVG at the same weight.
- Social links (GitHub, LinkedIn, WhatsApp, Instagram) use the platforms' official icons, unmodified, in `ink-muted`.
- No emoji in UI copy.
- Project imagery: real screenshots at 16:9, cropped to the product UI, on `surface-raised`. Until a screenshot exists, ProjectCard shows a mono monogram — never a stock photo.


## Logo

- **The mark:** "Ram" in Readex Pro Bold (700, tracked −0.03em) set across a giant `primary` R that is sliced open where the word passes through — the R stops a clear gap above and below the word. All violet: the R is `primary` (#A25BFF), the word is `logo-word` — pale violet #DCC6FF on Dark grounds, deep violet #5A1FB5 on Light.
- **One logo for both languages.** The Arabic site uses the same Latin "Ram" mark; there is no Arabic version.
- **Files** (`assets/Logos/`, outlined, no font needed): `ram-logo-on-dark.svg` and `ram-logo-on-light.svg` — pick by the ground, not the theme name.
- **Icon:** `ram-icon.svg` — the sliced R alone, `primary` on a `bg` (#0B0910) rounded square. Favicon, app icon, social avatar, and the nav.
- **Where:** the full lock-up in the hero, footer, cover, CV and OG images, at 48px tall or more. Below that, the icon plus "Ram" as live text in `logo-word` (the nav).
- Clear space: one stem width of the big R on every side. Never recolor, swap the two violets, close the gap, stretch, outline or add effects.

## Using it in code

- The tokens compile to CSS custom properties (`--bg`, `--primary`, `--space-5`, `--radius-md`, `--font-sans` …). Theme by setting `data-theme="dark" | "light"` on `<html>`; Dark is the default.
- With MUI, map the palette and shape to these variables in the theme (`cssVariables: true`) rather than hard-coding hex values, so one token change moves both the site and MUI components.
- Load fonts with `next/font/local` from the files in `fonts/` (latin + arabic Readex Pro, JetBrains Mono) and expose them as `--font-sans` / `--font-mono`.
- Reference components live in `components/bundle.js` as `window.RF` (React 18): `Button`, `Tag`, `StatusBadge`, `SectionHeading`, `StatCard`, `ProjectCard`, `TextField`, `NavBar`; class names are prefixed `rf-`.
