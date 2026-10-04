# Design system

## Source

- **Source of truth:** Ram's Claude Design system "Ram Farid", at https://claude.ai/artifact/UTAW2ng3yBPbMK7wpWZW5n
- **Local mirror:** `docs/design-system/`, pulled 2026-10-03. Treat it as read-only. Make changes in Claude Design, then pull them down again.
- **Re-sync:** read the artifact's `project/*` files and its asset store (the logos are uploaded assets, not published files). Replace the matching files under `docs/design-system/`. Put logos in `public/brand/` and fonts in `src/fonts/` (see below), and **update `src/app/globals.css` by hand** for any token change. Record the date here.

## What to read

- `docs/design-system/README.md`: the brand book (voice, colour roles, type, spacing, motion, focus, RTL, logo rules).
- `docs/design-system/tokens.json`: exact values for the Dark (default) and Light themes.
- `docs/design-system/components/<Name>/README.md`: what each component is for and the props it expects.
- **Ignore** the README's motion notes about the 3D cube; the cube is dropped (see `decisions.md`).
- `DESIGN.md` (repo root) and `.impeccable/design.json` describe the system as built, for the Impeccable design skill. They were generated from the code on 2026-10-03. Where they disagree with `docs/design-system/`, the mirror wins; regenerate them, don't hand-edit them.

## Tokens

The styling stack is Tailwind CSS 4, not MUI (decided 2026-10-03). All tokens live in `src/app/globals.css`.

1. **Runtime CSS variables** keep the design system's names: `--bg`, `--primary-ink`, `--space-5`, `--duration-fast`, `--nav-height`, and so on.
   - Colours and shadows are set once on `:root` (Dark) and overridden under `:root[data-theme='light']`.
   - Values that are the same in both themes (spacing, durations, layout, the `focus`/`link` aliases) are set once on `:root`.
2. **Tailwind's `@theme`** turns them into utilities. Tailwind's own palette, type scale, radii, shadows, easings and font families are **reset to `initial`**. Only design-system values exist as utilities, so `bg-zinc-800` or `text-lg` produce no CSS at all.

| Token family | Utilities | Notes |
| --- | --- | --- |
| Colour | `bg-bg`, `bg-surface`, `text-ink`, `text-ink-muted`, `text-primary-ink`, `bg-primary`, `text-on-primary`, `border-line`, `border-line-strong`, `outline-focus`, `bg-success-soft`, … | One utility per token name. Follow the README's colour roles: `primary` is a fill, `primary-ink` is text. |
| Type | `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`, `text-small`, `text-label`, `text-eyebrow`, `text-code`, `text-numeral`, `text-display-ar`, `text-h2-ar`, `text-body-ar` | Each one sets size, line-height, weight and tracking together. Add `font-mono` for `eyebrow`, `code` and `numeral`. Add `uppercase` for eyebrows (Arabic cancels it automatically). Under 768px, step headings down one level: `text-h1 md:text-display`. **Arabic swaps itself:** under `:lang(ar)`, `text-display`, `text-h2` and `text-body` take the `-ar` metrics, so write the same class in both languages. The `-ar` utilities exist but are rarely needed. |
| Spacing | `p-space-5`, `gap-space-7`, `py-space-9`, …, plus `h-nav` / `scroll-mt-nav` | Use the named `space-N` for layout rhythm (README: Layout & spacing). Numeric utilities (`p-2`, `w-64`) still exist on Tailwind's 4px base, which sits on the same grid, for one-off sizing. |
| Radius | `rounded-xs` 2px, `rounded-sm` 4px, `rounded-md` 8px, `rounded-lg` 12px, `rounded-full` | Values are redefined; Tailwind's `md`/`lg` are different sizes. |
| Shadow | `shadow-sm`, `shadow-md`, `shadow-glow` | These follow the theme through the `--elevation-*` variables. They're named `elevation` so they don't collide with Tailwind's `--shadow-*` namespace. |
| Motion | `ease-out`, `ease-in-out` (design-system curves); `duration-(--duration-base)` | Default transition = `duration-fast` + `ease-out`. Under `prefers-reduced-motion`, components drop transforms and pulses but keep colour changes; use `motion-safe:`. |
| Layout | `max-w-page` (1200px container), `max-w-measure` (68ch) | |
| Pattern | `dot-grid` | Hero and contact sections only, never behind long text. |

Global rules are in `@layer base`:

- the body uses `bg`, `ink`, `font-sans` and the `body` style;
- a 2px `focus` outline at 2px offset on every `:focus-visible`;
- text selection uses `primary-soft`;
- anchor targets get `scroll-margin-top: nav-height + space-4`.

**Arabic:** an unlayered `:lang(ar)` rule removes letter-spacing and uppercase. It's unlayered so no Tailwind utility can override it, because tracking breaks Arabic letter joins.

**Docs aren't scanned:** `@source not '../../docs'` keeps the mirror's bundle and preview class names out of the CSS build.

## Fonts

The font files live in `src/fonts/` (moved out of the mirror 2026-10-03) and are loaded with `next/font/local` in `src/fonts/index.ts`. The root layout puts all three variables on `<html>`.

- `--font-sans` = **Readex Pro Arabic → Readex Pro Latin (+ metric-adjusted Arial) → system-ui**
- `--font-mono` = **Readex Pro Arabic → JetBrains Mono → ui-monospace**

Why it's ordered this way:

- next/font gives each face its own family name plus, by default, a metric-adjusted **Arial** fallback face. Arial has Arabic glyphs, so any fallback placed ahead of the Arabic face would permanently render Arabic text in Arial.
- So the **Arabic face leads**, limited by `unicode-range` to Arabic code points so Latin text skips it. It has **no** Arial fallback.
- **Readex Latin** keeps its adjusted Arial fallback. That limits layout shift on English, the default locale, and also covers Arabic glyphs for the moment before the Arabic file loads.
- **JetBrains Mono** falls back to the system monospace instead of Arial.
- **All three are preloaded**, about 95 KB in total. The Arabic language switch appears on every English page, so the Arabic file is needed everywhere anyway.

## Components

`docs/design-system/components/bundle.js` is a React 18 global (`window.RF`) that only serves the Claude Design previews. **Don't import it.** Rebuild each component as a typed React 19 component in `src/components/ui/`, keeping its behaviour and following its guidelines.

## Logos and icon

- The logo SVGs live in `public/brand/` and are served at `/brand/*` (moved 2026-10-03): `ram-logo-on-dark.svg`, `ram-logo-on-light.svg`, `ram-icon.svg`. Their usage rules are still in `docs/design-system/assets/Logos/README.md`.
- `src/app/icon.svg` is a copy of `ram-icon.svg`, using the App Router icon convention. Update both together.

## Violet fields

The home page fills whole regions with violet (project band 1 and the contact section). Put `field-violet` on the region; don't give components an on-violet variant.

- The utility sets the background to the violet and **reassigns the colour roles inside it**:
  - text roles (`ink`, `ink-muted`, `primary-ink`, `logo-word`) and `line-strong` become the dark on-primary ink;
  - `line` and `primary-soft` become translucent ink, and `surface` becomes transparent;
  - `primary` becomes the dark ink and `on-primary` becomes the violet, so a primary button inside the field is dark with violet text (5.2:1);
  - `focus` becomes the dark ink, so the focus ring stays visible on violet;
  - `danger` becomes the dark ink too (added 2026-10-04 with the contact form), because the coral red is unreadable on violet. Errors there are told apart by their text, a `CircleAlert` icon and a doubled border, not by colour;
  - the caret becomes the dark ink. `body` sets `caret-color` to the violet, which inherits as a resolved colour and would vanish in a field.
- `--violet-fill` and `--violet-ink` (utilities `bg-violet-fill`, `bg-violet-ink`, `text-violet-*`) hold the real pair. They're resolved once on `:root`, and custom properties inherit their computed value, so the remapping can't change them. Use them for anything that must stay the real violet or the real ink inside a field, such as the dark screenshot slab in a project band.
- `success` and `warning` aren't remapped: don't put a `StatusBadge` on violet.
- Stack logo tags (`StackTag`) turn into dark chips inside a field (`violet-ink` ground, `violet-fill` text), so brand-coloured logos stay readable. The `RecommendedBadge` needs nothing: it's neutral ink and a hairline.

## Brand-coloured tool logos (the one-violet exception)

Since 2026-10-04 (phase 3), project stacks show each tool's logo in its **brand colour**. Ram chose this explicitly ("always", over single-colour and colour-on-hover), so it's the one place the site shows colours beyond the violet and the status colours. Contain it:
- Brand colour belongs to the 14px logo mark only; the tag itself stays the standard mono `Tag` (text, border and ground from tokens).
- A brand colour under 2.5:1 against `surface` is stored as `null` and draws in the tag's text colour; tools without a logo get a two-letter mono monogram. Each logo sits beside its name, so colour never carries meaning.
- Don't reuse brand colours anywhere else (headings, borders, charts). Details: `portfolio.md#stack`.

## Components (built)

These live in `src/components/ui/` and follow their READMEs in `docs/design-system/components/`. Differences from the reference bundle:

| Component | Notes |
| --- | --- |
| `Button`, `ButtonLink` | Split in two instead of one component with `href`. `ButtonLink` uses the locale-aware `Link` for paths starting with `/`, and plain `<a>` for hashes and URLs. `external` opens a new tab with an up-and-out arrow and screen-reader text. `buttonClasses()` styles other links as buttons (the language switch). |
| `Arrow` | The trailing arrow: mirrors in RTL and nudges 3px on `group` hover, but not under reduced motion. |
| `Tag` | Uses `text-code` (14px). The bundle's 13px has no token. |
| `StatusBadge` | The success dot pulses with `motion-safe:animate-status-pulse`. |
| `SectionHeading` | `id` goes on the heading, for `aria-labelledby`. |
| `StatCard` | Adds an optional `note` line ("Since November 2021"). |
| `TextField`, `TextArea` | The bundle's `multiline` is a separate `TextArea`. `id` defaults to `name`. The message is wired with `aria-describedby`, and `aria-invalid` is set on error. An error also gets a `CircleAlert` icon and a doubled border (`ring-1`), so it never depends on colour alone. Fields in a two-column row align to the top (`content-start`) when one has a longer message. The browser's autofill tint is suppressed so text stays readable on violet. |
| `NavBar` | Section links are plain hash anchors. Under `md` they collapse into `menu` (the site's `NavMenu`, a native popover). The shadow on scroll is CSS only (`.scroll-shadow`). |
| `Container` | The 1200px page container with its gutters. |
| `LocalizedField` | Not in the bundle (added for the console, 2026-10-04). A `TextField`/`TextArea` holding one value per locale, with a mono locale-code button at its end that opens a native popover of the other languages (filled, missing or needs a fix). Contract: `console.md#localized-field`. |
| `TagInput` | Not in the bundle (console, 2026-10-04). Mono tags in a field-styled box: Enter or a comma adds, Backspace removes the last, LTR in both languages. The box carries the focus ring because the inner input drops its own. |

Icons are lucide-react at stroke 1.75 (the project's icon choice in `CLAUDE.md`). They replace the README's Material Symbols.

Shared compositions and utilities added with `/portfolio` (2026-10-04, `portfolio.md`):
- `Reusable/projects/ProjectSlab`: a 16:9 cover on a dark `violet-ink` slab for violet fields, with the monogram fallback.
- `Reusable/media/PhotoViewer`: the one react-photo-view provider and caption bar, used by certificates and screenshots.
- `Reusable/site/ContactCall`: the closing call on pages other than home.
- In `globals.css`: `film-rail` (the sideways scroll-snap rail aligned to the container), the `[data-frame] > article` focus rule, and `story-prose` (token styles for the case-study HTML).
- No new tokens.

Projects console and public additions (2026-10-04, phase 3, `portfolio.md#console`):
- `ui/LocaleSwitch`: the locale-code button and its popover, shared by `LocalizedField` and the story editor.
- `TextField` gained `controlClassName` (the slug input is mono), and its message is one flex item so rich hints (an isolated `<bdi>` path) flow as text.
- `Reusable/projects/StackTag` and `StackLogo` (logo tags, see above) and `RecommendedBadge` (a filled lucide star and "Recommended", neutral ink, 4px corners, 28px tall; one per project, beside the meta line or under the summary, never above a heading).
- `Console/Projects/ProjectStatusBadge`: Published is a teal dot and teal text on a hairline in `success`, Draft a hairline badge in `ink-muted`.
- `Console/Markdown/MarkdownField`: the story editor. Its live preview is `.md-editor` in `globals.css`, built from the same tokens as `story-prose`: headings at `h3`/`h4`, `strong` 600, inline code and code blocks in mono on `bg` with a hairline and 4/8px corners, quotes with a 1px `line-strong` rule, links in `link` with a 4px underline offset, task boxes 14px with 2px corners (checked: a `primary` square inside a ring of the ground, from tokens only), images in a hairline 8px frame, tables with hairline rows and `ink-muted` headers. Code fences hide outside the caret and leave the language as a small `ink-muted` label.
- `story-prose` gained task-list checkboxes, `del`, `sup` and the footnotes block.
- No new tokens.

Console compositions (2026-10-04, `console.md`): `Console/ConsoleRail`, `SectionPanel` (sticky header; Save is primary only while dirty), `SortableList` (grip handle, pointer drag and arrow keys), `ImageUpload` (presigned R2 upload into a 4:5 or 4:3 frame), `ListParts`. In `globals.css`: `.locale-popover` (anchor positioning for `LocalizedField`). `TextField` now exports `controlClasses`; `Button` gained a neutral `quiet` variant for secondary actions beside a primary. No new tokens.
