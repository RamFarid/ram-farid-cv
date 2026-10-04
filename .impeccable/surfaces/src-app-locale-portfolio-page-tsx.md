---
version: 1
slug: "src-app-locale-portfolio-page-tsx"
primary_target: "src/app/[locale]/portfolio/page.tsx"
related_targets: []
---

# Portfolio index surface brief

- **Scope:** `/[locale]/portfolio`, English and Arabic (RTL). Visitor mode: Experience.
- **Audience and job:** clients and recruiters arriving from the home page's "See all projects" link, a shared link or search. Their job is to pick a project and open its case study.
- **Division of labour (Ram, 2026-10-04):** the index teases and the case study proves. The index shows only the cover, title, kind · year and the one-sentence summary. Client, stack, role, dates, live and repo links live on `/portfolio/[project_id]`, so the case study keeps a reason to exist.
- **Content range:** 6–15 published projects in console order, no filters. Real client work only.
- **Close:** a contact call with Start a project.
- **Open:** real covers (R2) and summaries for each project (waiting on Ram).

## Direction contract

THESIS: The index is one strip of full-size frames you pull sideways, each frame a cover and a one-line brief that makes you open the case study. It refuses the category default, a grid of equal project cards carrying every fact, and gives nothing away that the case study owns.

OWN-WORLD: The Ram Farid world. A violet field band carries the rail; frames are dark violet-ink slabs at 16:9 with on-violet ink captions (title, mono meta `01 · kind · year`, body-large summary). Around it: the dark ground, 1px hairlines, radii 4/8/12, Readex Pro for words, JetBrains Mono for numbers and meta. No eyebrows above headings; the meta sits under the title.

STORY: In one glance the visitor sees that this is shipped client work at screenshot scale, pulls through the frames, picks one and opens its case study. The contents list below answers "what's in here" for anyone who won't scroll sideways, and the close points to contact.

FIRST VIEWPORT: The floating nav bar with Work current. A compact head on the ground: the h1 at display size and a one-line first-person lead on the start side; on the end side the live project count, then the mono `01 / N` counter with prev and next buttons (moved up from under the rail after the finish review, so the sideways control is in the first view). Then the violet band: frame 01 sized by `min(84vw, 840px, (100svh − 480px) × 1.77)` (about 750px on a 1440×900 screen) so its title, meta and summary fit the first view, and frame 02 peeking at the end edge.

FORM: Film strip, made brief: the dealt lead of the surface hand (seed key 94b35616, `concept-seed --scope surface --mode experience`; dealt indices 5, 4, 6, lead fifth on the ranked list), revised on Ram's steer so the index only teases. Signature interaction: native scroll-snap rail whose frames dim (to 35%) and shrink (to 90%) as they leave the rail's view, scaled by the square of the visible fraction. The FilmStrip client island sets `--frame-focus` per frame in a requestAnimationFrame on scroll and CSS applies it; this replaced the planned CSS inline view timeline because Chromium's inline view timelines fail in RTL scrollers (verified in /ar on 2026-10-04). The same island owns the counter and prev/next buttons. Motion grammar: that frame focus, plus the site's 3px arrow nudges. All of it is off under reduced motion, and frames stay at full strength without JavaScript.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
