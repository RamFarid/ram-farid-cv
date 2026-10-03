---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: []
---

# Home page surface brief

- **Scope:** `/[locale]` home page, English and Arabic (RTL). Visitor mode: Persuade.
- **Audience and job:** freelance clients first (decide whether to get in touch), hiring teams second (find stack and CV fast).
- **Action:** Start a project (to the contact form, step 5). Secondary: Download CV.
- **Proof:** two live client projects (HISTORY game, Ramlyon), live figures (years since 2021-11-13, 16 clients, published project count), verifiable certifications. Nothing invented.
- **Plan and build steps:** `docs/home.md`.
- **Memorable moment:** project 1 owns a full-bleed violet field, and its screenshot rises into the band as it scrolls in.
- **Open:** real project content and screenshots, portrait, services wording, skills grouping, certifications, socials, CV URL (all waiting on Ram).

## Direction contract

THESIS: The work leads the page. The first two published projects by console order each get a compact full-width band, the first on a violet field, and the Work heading points to /portfolio for the rest (amended 2026-10-04: no hand-picked projects). This refuses the category default of a hero followed by a grid of small project cards.

OWN-WORLD: The Ram Farid design system played at page scale. A near-black ground and one violet that fills whole regions, as the Cover blocks do, never as scattered accents. Violet-tinted neutrals and 1px hairlines; radii of 4/8/12. The dot grid appears only behind the intro. Readex Pro for words and JetBrains Mono for data (meta, tags, figures). On violet everything is on-primary ink: a dark primary button, outlined tags and a dark focus ring.

STORY: In one line the visitor learns who Ram is and what he builds, then sees shipped client work at full size before anything else. Then the person behind it, with live figures, what a client can hire him for, the stack, verifiable certificates, and finally contact.

FIRST VIEWPORT: The floating bordered nav bar (R icon and "Ram", five section links, a language switch, a small secondary Download CV). Below it the intro strip on the dot grid, about 40% of the height: an h1 at display size, a first-person lead naming Ram, an availability badge, then Start a project (primary) and Download CV (secondary), on the end side on desktop. The violet Work field starts above the fold, showing its heading and the top of project 1's 16:9 screenshot; the fold cuts it.

FORM: Project bands, the dealt lead ("THE ROLL") of the re-rolled surface hand, which Ram locked; first on that hand's ordered list. Seed key 7a316bff (printed as "SURFACE CONCEPT SEED (key: 7a316bff; mode: persuade)" by concept-seed --scope surface; the locked hand was its re-roll, --from 7a316bff --reroll 1). Signature interaction: project screenshots rise into their band as it enters the viewport, scroll-driven in CSS with no JavaScript; the nav bar gains its shadow the same way. Motion grammar: one scroll-linked rise for media and arrows that nudge 3px toward their direction on hover. All of it is off under reduced motion, and content stays visible where scroll timelines are unsupported.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
