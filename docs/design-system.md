# Design system

## Source

- **Source of truth:** Ram's Claude Design system "Ram Farid", at https://claude.ai/artifact/UTAW2ng3yBPbMK7wpWZW5n
- **Local mirror:** `docs/design-system/`, pulled 2026-10-03. Treat it as read-only. Make changes in Claude Design, then pull them down again.
- **Re-sync:** read the artifact's `project/*` files and its asset store (the logos are uploaded assets, not published files). Replace the matching files under `docs/design-system/`, and put logos in `public/brand/` (see below). Record the date here.

## What to read

- `docs/design-system/README.md`: the brand book (voice, colour roles, type, spacing, motion, focus, RTL, logo rules).
- `docs/design-system/tokens.json`: exact values for the Dark (default) and Light themes.
- `docs/design-system/components/<Name>/README.md`: what each component is for and the props it expects.

## How it maps to code

- **Styling (decided 2026-10-03):** Tailwind CSS 4, not MUI. The tokens become CSS custom properties on `:root` / `[data-theme]` and are exposed to Tailwind through `@theme` in `src/app/globals.css`.
- **Theme:** set `data-theme="dark" | "light"` on `<html>`. Dark is the default.
- **Fonts:** load them with `next/font/local` from the files in `docs/design-system/fonts/` (copied into the app), exposed as `--font-sans` and `--font-mono`.
- **Components:** `components/bundle.js` is a React 18 global (`window.RF`) that only serves the Claude Design previews. **Don't import it.** Rebuild each component as a typed React 19 component in `src/components/ui/`, keeping its behaviour and guidelines.
- **Logos (moved 2026-10-03):** the SVGs live in `public/brand/` (`ram-logo-on-dark.svg`, `ram-logo-on-light.svg`, `ram-icon.svg`) and are served at `/brand/*`. They were moved out of the mirror so there's only one copy; their usage rules are still in `docs/design-system/assets/Logos/README.md`. A re-sync puts new logo versions in `public/brand/`, not in the mirror.
- **App icon:** `src/app/icon.svg` is a copy of `ram-icon.svg` (the App Router icon convention, which replaces the scaffold's `favicon.ico`). Update both together.
