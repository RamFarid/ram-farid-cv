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
