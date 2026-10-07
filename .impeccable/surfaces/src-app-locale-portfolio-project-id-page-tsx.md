---
version: 1
slug: "src-app-locale-portfolio-project-id-page-tsx"
primary_target: "src/app/[locale]/portfolio/[project_id]/page.tsx"
related_targets: []
---

# Case study surface brief

- **Scope:** `/[locale]/portfolio/[project_id]` (the project's `slug`), English and Arabic (RTL). Visitor mode: Experience.
- **Audience and job:** a client or recruiter who opened a project from the index or a shared link. They need to see what was built, what Ram's part was and that it is real, then get in touch.
- **Action:** Start a project at the close (primary). Visit live site in the head (secondary); Source code only when the project has a public repo (most are private).
- **Content (Ram, 2026-10-04):** a full case study for every project. Structured head fields (client, role, kind, start and end dates, stack), an overview, a deliverables list, and a free-form story stored as sanitized HTML per locale and rendered with `dangerouslySetInnerHTML`. Up to 15 screenshots in total, desktop and phone mixed, stored in R2.
- **Open:** real case-study copy and screenshots for HISTORY game and Ramlyon (waiting on Ram).

## Direction contract

THESIS: The screens lead. Right after a compact head, a full-width stage shows one screen at a time in the centre with its neighbours peeking in, desktop and phone screenshots at one shared height, then the story explains them. (Justified rows until 2026-10-07; replaced because a 15-screen project ran several viewports tall.) It refuses the case-study template of a hero image, a wall of prose and a few screenshots at the bottom.

OWN-WORLD: The Ram Farid world. The head sits on the dark ground and the screen stage on a full-width `surface` band; screenshots in 8px-radius frames on `surface-raised` with 1px hairlines, opening full size in the themed viewer. The story reads in ruled rows: a heading on the start side, the text at a 68ch measure on the end side. The next project returns in the index's vocabulary on a violet field with a dark slab. Mono for dates, durations, counts and stack; Readex Pro for words. No eyebrows above headings.

STORY: The visitor reads the title and one-line summary with the facts beside it (client, role, timeline, stack, live link), steps through the screens on the stage, then reads the overview, Ram's role, what was delivered and how it was built. They move to the next project or start a project.

FIRST VIEWPORT: The nav bar with Work current. A breadcrumb (Work / title), then on 8 columns the h1 at display size and the summary in body-large; on the end 4 columns a ruled facts list and Visit live site. The stage starts above the fold on a 1440×900 screen and, once scrolled to, shows its head, the centred screen (56svh), the caption and the thumbnail strip in one view. On phones the facts sit two to a row so the screens start sooner; the stage swipes natively and is only as tall as its tallest screen.

FORM: Gallery first: the second of three dealt structures in the case-study hand (seed key d2aed43d, `concept-seed --scope surface --mode experience`; dealt indices 4, 2, 5, lead fourth on the ranked list), locked by Ram. Signature interaction (2026-10-07, Ram chose "stage and thumbnails", centred, thumbnails on every size): a native scroll-snap stage in console order whose screens dim and shrink with distance from the centre (the film strip's frame focus); the arrows, thumbnails and arrow keys glide it with an exponential ease-out; the centred screen opens the viewer and the stage follows the viewer, so closing zooms back into the last screen seen. Motion grammar: the glide, the frame focus, a caption swap, a sliding thumbnail marker, the violet glow on the hovered centre screen, and jumps with dimming only under reduced motion. Contract: docs/portfolio.md#screens.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
