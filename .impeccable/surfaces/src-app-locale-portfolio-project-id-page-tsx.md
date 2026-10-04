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

THESIS: The screens lead. Right after a compact head, the whole gallery runs in justified rows that mix desktop and phone screenshots at one shared height, then the story explains them. It refuses the case-study template of a hero image, a wall of prose and a few screenshots at the bottom.

OWN-WORLD: The Ram Farid world. The head and gallery sit on the dark ground; screenshots in 8px-radius frames on `surface-raised` with 1px hairlines, opening full size in the themed viewer. The story reads in ruled rows: a heading on the start side, the text at a 68ch measure on the end side. The next project returns in the index's vocabulary on a violet field with a dark slab. Mono for dates, durations, counts and stack; Readex Pro for words. No eyebrows above headings.

STORY: The visitor reads the title and one-line summary with the facts beside it (client, role, timeline, stack, live link), sees every screen at once, then reads the overview, Ram's role, what was delivered and how it was built. They move to the next project or start a project.

FIRST VIEWPORT: The nav bar with Work current. A breadcrumb (Work / title), then on 8 columns the h1 at display size and the summary in body-large; on the end 4 columns a ruled facts list and Visit live site. The gallery's first justified row starts above the fold on a 1440×900 screen, its screens at a shared base row height of 300px (growing at most 1.5× so an early wrap never balloons). On phones the facts sit two to a row so the screens start sooner; desktop shots take the full width and phones pair up in source order.

FORM: Gallery first: the second of three dealt structures in the case-study hand (seed key d2aed43d, `concept-seed --scope surface --mode experience`; dealt indices 4, 2, 5, lead fourth on the ranked list), locked by Ram. Signature interaction: justified rows laid out in CSS from each screenshot's stored aspect ratio, with no JavaScript and no layout shift (visual order always equals source order); every screen opens full size with arrow-key stepping through the whole set. Motion grammar: a 2px lift and the violet glow on the hovered screen (one at a time), the site's 3px arrow nudges, and a near-instant viewer under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
