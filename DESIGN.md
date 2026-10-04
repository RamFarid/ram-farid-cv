---
name: Ram Farid
description: Personal site of Ram Farid, full-stack JavaScript engineer. Dark ground, one violet that fills whole regions.
colors:
  bg: "#0b0910"
  surface: "#131019"
  surface-raised: "#1c1825"
  line: "#2b2538"
  line-strong: "#6c6380"
  ink: "#f3f0f8"
  ink-muted: "#9d95ae"
  primary: "#a25bff"
  primary-hover: "#b578ff"
  primary-ink: "#be8cff"
  primary-soft: "#24173a"
  on-primary: "#0b0910"
  logo-word: "#dcc6ff"
  success: "#34d1bf"
  success-soft: "#0e2826"
  warning: "#f5b84a"
  warning-soft: "#2c2010"
  danger: "#ff7a6b"
  danger-soft: "#321613"
typography:
  display:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "64px"
    fontWeight: 600
    lineHeight: "68px"
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 600
    lineHeight: "52px"
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "40px"
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: "30px"
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 300
    lineHeight: "30px"
  body:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
  small:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
  label:
    fontFamily: "Readex Pro, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "22px"
  numeral:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "44px"
    letterSpacing: "-0.02em"
rounded:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "24px"
  space-6: "32px"
  space-7: "48px"
  space-8: "64px"
  space-9: "96px"
  space-10: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-raised}"
  button-ghost:
    textColor: "{colors.primary-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.primary-soft}"
  button-sm:
    padding: "0 16px"
    height: "36px"
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "28px"
  tag-selected:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
  status-badge-success:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "28px"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  nav-bar:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    height: "64px"
  nav-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "36px"
  nav-link-current:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-ink}"
  stat-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
    rounded: "{rounded.lg}"
    padding: "24px"
  violet-field:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  project-media-on-violet:
    backgroundColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
  project-media:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
  screen-thumb:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.md}"
---

# Design System: Ram Farid

Recorded from the shipped home page on 2026-10-03, and extended on 2026-10-04 with the portfolio index and case study. The source of truth is Ram's own system: the brand book `docs/design-system/README.md`, the values in `docs/design-system/tokens.json`, the component guidelines in `docs/design-system/components/*/README.md`, and the code mapping in `docs/design-system.md`. This file describes how that system landed in code. Where they disagree, those docs win and this file is stale.

## Overview

**Creative North Star: "The work on a violet field"**

A near-black ground with one violet. The violet doesn't sprinkle accents across the page. It fills whole regions, the way the Cover blocks in Ram's system do, and shipped work sits inside them at screenshot scale. Everything else is quiet: violet-tinted neutrals, 1px hairlines, small radii, and type that does the work.

The look is technical and precise, not cold. Words are set in Readex Pro and anything that is data (tags, figures, project meta, issuers and dates) is set in JetBrains Mono. Density is calm: sections breathe on a 96px vertical rhythm on desktop, and content sits in a 1200px container with a 68ch reading measure.

English and Arabic are built together. Layout uses logical sides only, so the whole page mirrors in RTL, and Arabic swaps its own type metrics.

**Key Characteristics:**
- Dark by default; one violet; neutrals tinted toward it.
- Violet as a field, not a sprinkle: a whole band goes violet and every primitive inside switches to the dark ink.
- 1px borders before shadows; shadows only for floating or hovered things.
- Radii of 4, 8 and 12px, nothing rounder except status dots.
- Mono for data, Readex Pro for words.
- Two signature layouts for shipped work: the project band, and the film strip of dark slabs on a violet field.
- One motion grammar, tied to scroll: the media rise, the nav shadow and the film strip's frame focus, plus 3px arrow nudges and 2px hover lifts. All off under reduced motion.

## Colors

One violet on a near-black, violet-tinted ground. Values are the Dark theme, which is the default. The Light theme lives under `:root[data-theme='light']` in `src/app/globals.css` and in `tokens.json`; the home page doesn't switch to it yet.

### Primary
- **Signal violet** (primary): a fill, never text. Primary buttons, and whole violet fields (the first project band, and the contact section once it ships).
- **Lifted violet** (primary-hover): the primary button's hover fill.
- **Readable violet** (primary-ink): violet as text. Highlighted words in the h1, links such as "Verify", stat units, the current nav link.
- **Violet wash** (primary-soft): tinted grounds for the current nav link, selected tags, ghost button hover and text selection.
- **Pale lilac** (logo-word): the "Ram" wordmark in the nav bar only.

### Neutral
- **Night ground** (bg): the page background.
- **Raised night** (surface): alternating section bands, the nav bar, tags, stat cards, fields.
- **Panel night** (surface-raised): hover grounds, media frames without a screenshot, the portrait frame.
- **Hairline** (line): every 1px divider and card border.
- **Strong hairline** (line-strong): secondary button and field borders, monogram placeholders.
- **Lavender white** (ink): primary text.
- **Muted lavender** (ink-muted): leads, meta, labels in second position.
- **On-violet ink** (on-primary): text on a primary fill, and every text role inside a violet field.

### Status
- **Teal** (success, success-soft): the availability badge. Warning and danger exist for forms and the console; the home page uses neither.

### Named Rules
**The Field Not Sprinkle Rule.** Violet covers a whole region or a single primary control. It never decorates borders, icons or backgrounds in scattered spots.

**The Fill Versus Ink Rule.** `primary` is a fill and `primary-ink` is text. Never set body text in `primary`.

**The Field Remap Rule.** A region goes violet with the `field-violet` utility, which reassigns the colour roles inside it: text and strong lines become the on-violet ink, `line` and `primary-soft` become translucent ink, `surface` goes transparent, and the primary button becomes dark with violet text. Components never get their own on-violet variant. Use `violet-fill` and `violet-ink` for anything that must stay the real pair inside a field, such as the dark screenshot slab. Status colours aren't remapped, so no status badge on violet.

## Typography

**Body font:** Readex Pro (Latin and Arabic faces, Arabic leading by unicode-range), with system-ui.
**Mono font:** JetBrains Mono, with ui-monospace. Arabic inside mono falls back to Readex Pro Arabic.

**Character:** a geometric, open sans for a warm first-person voice, and a mono that marks everything measurable as data.

### Hierarchy
- **Display** (600, 64px, 68px): the intro h1 from `md` up, and the mono monograms in empty media frames.
- **Headline** (600, 44px, 52px): the intro h1 under `md`, and project titles from `md` up.
- **Title large** (600, 32px, 40px): section titles and project titles under `md`.
- **Title** (500, 22px, 30px): service names, certificate names, the nav wordmark.
- **Body large** (300, 18px, 30px): leads and project summaries, held to a 68ch measure.
- **Body** (400, 16px, 26px): running text and field values.
- **Small** (400, 14px, 22px): meta labels, footer text, stat labels.
- **Label** (500, 14px, 20px): buttons, nav links, field labels, link text.
- **Code** (400, 14px, 22px, mono): tags, certificate issuer and date.
- **Numeral** (500, 40px, 44px, mono, tabular): stat figures.

Each `text-*` utility sets size, leading, weight and tracking together. Headings step down one level under 768px (`text-h1 md:text-display`).

### Named Rules
**The Data Is Mono Rule.** Tech names, figures, years, issuers and dates are JetBrains Mono, with tabular numerals for figures. Prose is never mono.

**The Arabic Swap Rule.** Under `:lang(ar)` letter-spacing and uppercase are removed, and display, h2 and body take their Arabic metrics (56/76, 30/44, 17/30). Write the same class in both languages. Digits stay Western.

## Layout

- **Container:** 1200px max, 16px gutters on mobile and 32px from `md`.
- **Grid:** a 12-column grid from `lg`. Project bands split 6 (media) and 6 (text) and alternate sides band to band. The intro lead takes 7 columns with the actions on the end side in 5.
- **Vertical rhythm:** sections pad 64px on mobile and 96px from `md`. Inside a section, heading to content is 48px, and stacked blocks are 24 to 32px apart.
- **Bands:** sections alternate between `bg` and `surface`, separated by 1px top and bottom hairlines. The first project band is a violet field.
- **Lists:** services are rows split by hairlines, not cards. Certifications are a gallery of the certificate images on 4:3 `surface-raised` mats (3/2/1 columns), each opening full size in a themed viewer.
- **Dot grid:** 1px `line` dots at a 64px pitch, behind the intro and a standalone contact close only, never behind long text.
- **Page heads off home:** compact, so the work starts in the first view. The top pad clears the nav plus 16px, then 48px (index) or 32px rising to 64px from `md` (case study). From `lg` the h1 and lead take the start columns and the facts or controls sit on the end side (columns 9 to 12).
- **Film rail:** a full-bleed violet band holding a sideways scroll-snap rail. The first frame lines up with the container edge and the next frame peeks past the end edge. Frames are `min(84vw, 840px)`, also capped by the viewport height so a frame and its caption fit the first view. The scrollbar is hidden; a mono `01 / 08` counter and 44px square secondary prev/next buttons stand in for it.
- **Justified rows:** screenshots of mixed ratios share rows at one height (220px from `sm`, 300px from `lg`), each growing in proportion to its ratio, capped at 1.5x, with a trailing filler so a short last row doesn't stretch. Under `sm` desktop shots go full width and phones pair up. CSS only, never cropped.
- **Ruled rows:** long-form content sits in rows split by 1px hairlines, the heading on the start 4 columns and the text on the end 8 at the 68ch measure. Fact lists and contents lists are ruled the same way, label then value.
- **Nav:** fixed, floating 16px below the top, inside the container. Anchor targets clear it with `scroll-margin-top` of nav height plus 16px.
- **Logical sides only:** `ps`, `me`, `start`, `text-start`, so the page mirrors in RTL.

## Elevation & Depth

Flat by default. Depth reads through the step from `bg` to `surface` to `surface-raised` and through 1px hairlines. Shadows appear on things that float (the nav bar once the page scrolls, the mobile menu) or answer a hover (the primary button, linked media, teaser slabs, screenshot thumbnails).

### Shadow Vocabulary
- **Hairline lift** (`0 1px 2px rgba(0, 0, 0, 0.5)`): text fields at rest.
- **Float** (`0 8px 24px rgba(0, 0, 0, 0.45)`): the nav bar after 64px of scroll, and the mobile menu popover.
- **Violet glow** (`0 0 0 1px rgba(162, 91, 255, 0.45), 0 12px 40px rgba(162, 91, 255, 0.18)`): hover on the primary button, linked project media, teaser slabs and screenshot thumbnails. Inside a violet field it becomes a soft ink shadow.

### Named Rules
**The Borders First Rule.** Separate with 1px borders first and shadows second.

**The One Glow Rule.** The violet glow sits on one element at a time, and only on hover.

## Shapes

Small, even corners. Tags, status badges and the skip link take 4px. Buttons, nav links and fields take 8px. Cards, the nav bar, the menu and media frames take 12px. Only status dots are fully round. Grouped stat cards drop their own corners and borders and sit in one 12px frame split by 1px hairlines. Project media and teaser slabs are 16:9 and clipped to their frame; the portrait frame is 4:5. Screenshot thumbnails take 8px corners and keep the image's own ratio, so nothing is cropped.

## Components

Built in `src/components/ui/` from the component READMEs in `docs/design-system/components/`. Differences from the reference bundle are listed in `docs/design-system.md#components-built`.

### Buttons
- **Shape:** gently rounded (8px), 44px tall (36px small), label type, 8px gap to icons.
- **Primary:** violet fill with on-violet ink. At most one per view. Hover lifts the fill to `primary-hover` and adds the violet glow.
- **Secondary:** transparent with a strong hairline border and ink text. Hover warms the border to `ink-muted` and fills `surface-raised`. Download CV and the language switch use it.
- **Ghost:** violet ink text, tight 12px padding, `primary-soft` on hover.
- **Arrow:** a trailing lucide arrow at 18px, stroke 1.75, mirrored in RTL. It nudges 3px forward on hover, or up and out for external links.
- **Focus:** a 2px `focus` outline at 2px offset, everywhere. **Disabled:** 45% opacity, no glow.

### Chips
- **Tag:** mono code type in `ink-muted` on `surface`, 1px hairline, 4px corners, 28px tall. Written as the project writes the tech name.
- **Selected:** violet border, `primary-soft` ground, `primary-ink` text. Only toggle tags select.
- **Status badge:** a 28px badge with 4px corners and a dot; the success dot pulses unless motion is reduced. One per area.

### Cards / Containers
- **Stat card:** `surface` ground, 1px hairline, 12px corners, 16 to 24px padding. The figure is a mono numeral, its unit in `primary-ink`, then a small label and optional note.
- **Shadow strategy:** none at rest (see Elevation & Depth).

### Inputs / Fields
- **Style:** `surface` ground, strong hairline border, 8px corners, 44px tall, 16px side padding, hairline lift shadow. The label is always visible above.
- **Focus:** the border turns violet plus the global focus ring.
- **Error:** danger border and a danger message that says what to do, wired with `aria-describedby`.

### Navigation
- **Nav bar:** a floating 64px bar on `surface` with a 1px hairline and 12px corners. The R icon and "Ram" in `logo-word`, up to five section links, then the language switch and a small secondary Download CV.
- **Links:** label type in `ink-muted`; hover fills `surface-raised` and turns ink; the current link sits on `primary-soft` in `primary-ink`.
- **Off home:** the section links point back to the home page, and Work opens /portfolio as the current link.
- **Mobile:** under `md` the links collapse into a native popover menu: a 12px `surface` panel with the float shadow, 44px rows, and Download CV below a hairline.
- **Scroll:** the bar gains the float shadow over the first 64px of scroll, in CSS only.

### Project band
The signature component. One of the first two published projects by console order, in a compact band: a 16:9 media frame on 6 columns and the text on 6, alternating sides from band to band. The Work heading above the first band links to /portfolio.
- **Media:** 12px frame on `surface-raised` with a hairline, or a dark `violet-ink` slab inside the violet field. Without a screenshot it shows a mono monogram, never a stock image. Linked media lifts 2px and takes the glow on hover.
- **Text:** mono meta line (kind and year), the project title, a body-large summary, a hairline, the client and the stack as tags, then a secondary "Visit" button that opens the live site.
- **Rise:** the media rises 64px into place as the band scrolls in (`animation-timeline: view()`, entry 0% to cover 40%). No JavaScript. Off under reduced motion, and static where scroll timelines are unsupported.

### Film strip
The second signature, for the full list of work: every project as a frame on the film rail (see Layout), in console order.
- **Frame:** a project teaser (below) at rail width, captioned with the title in title-large type, the mono meta `01 · kind · year` with tabular figures, and a body-large summary.
- **Frame focus:** frames dim (to 35% opacity) and shrink (to 90%) as they leave the rail's view, scaled by the square of the visible fraction, so a half-visible frame already reads as set back. A small client island writes each frame's visible fraction on scroll and CSS applies it. Under reduced motion or without JavaScript every frame stays at full strength.
- **Contents:** below the rail, every project as a ruled row (mono number, title, mono year, arrow) for visitors who won't scroll sideways. Rows fill `surface-raised` on hover.

### Project teaser
A project's 16:9 cover on a dark `violet-ink` slab with a violet-ink hairline and 12px corners, for violet fields: the film strip frames and the next-project band. It keeps the real violet pair inside the field. Without a cover it shows the mono monogram in `violet-fill`.
- **Caption:** title, mono meta, body-large summary, then a label-type "Read the case study" with the trailing arrow.
- **Link:** the title's link stretches over the whole teaser; focus draws the focus ring around the whole teaser at 4px offset.
- **Hover:** the slab lifts 2px and takes the glow, and the arrow nudges.

### Screen gallery
Screenshots in justified rows (see Layout), under a title with a mono count. Each thumbnail is a button on `surface-raised` with a 1px hairline and 8px corners; hover turns the border violet, lifts 2px and adds the glow. Each opens full size in the image viewer.
- **Image viewer:** shared by certificates and screenshots. Arrow keys step through the set and Esc closes. The caption bar is a `surface` strip with a hairline above it: label-type title, mono device and position.

### Story
The case study's words, in ruled rows (see Layout): an overview in body large, deliverables as a ruled list, then the console's story HTML. That HTML takes token styles only: h2 and h3 at title size, h4 at label size, 16px gaps, `ink-muted` list markers, underlined `link` links, mono inline code and blocks on `surface` with a hairline, blockquotes with a strong-hairline start rule, images with 8px corners, and tables in small type with hairline rows that scroll inside their own box on phones.

### Contact call
The close of every page except home: an h2, a body-large line, and the primary Start a project button with its arrow, linking to the home contact form. On the index it sits on the end side beside the contents list; after a case study it stands alone on the dot grid, worded for one project.

## Do's and Don'ts

### Do:
- **Do** build from the tokens in `src/app/globals.css` only. Tailwind's own palette, type scale, radii and shadows are reset, so off-system classes produce no CSS.
- **Do** turn a whole region violet with `field-violet` and let the primitives inside remap themselves.
- **Do** set data (tech names, figures, years, issuers, dates) in JetBrains Mono, figures with tabular numerals.
- **Do** separate with 1px hairlines and step between `bg`, `surface` and `surface-raised` before reaching for a shadow.
- **Do** keep motion to the scroll-linked rise, the nav shadow, the film strip's frame focus, 3px arrow nudges and 2px hover lifts, all behind `prefers-reduced-motion: no-preference`, with content visible and at full strength when it doesn't run.
- **Do** use logical sides and build English and Arabic in the same change.
- **Do** use lucide icons at stroke 1.75.
- **Do** show a mono monogram where a screenshot or portrait is missing.

### Don't:
- **Don't** use raw hex values or ad-hoc spacing in components.
- **Don't** give components an on-violet variant, or put a status badge on violet.
- **Don't** use gradients between hues or blue-to-purple washes; the only glow is the violet glow, one element at a time.
- **Don't** put the dot grid behind long text or anywhere but the intro and a standalone contact close.
- **Don't** use radii above 12px on anything but status dots.
- **Don't** add letter-spacing or uppercase to Arabic text.
- **Don't** use stock imagery for projects or the portrait.
