# Console projects surface brief

- **Scope:** `/[locale]/console/portfolio` (index) and `/[locale]/console/portfolio/[project_id]` (edit page), English and Arabic (RTL). Visitor mode: Operate.
- **Audience and job:** Ram, adding a client project, filling its case study in both languages, then publishing, recommending (starring) and ordering what the public site shows.
- **Content:** `Projects` documents: title, kind, client, summary (localized), slug, live and repo links, starred, start and end dates, stack ids from `lib/projects/stack.ts` (89 tools with brand logos), a 16:9 cover with alt, up to 15 screenshots (desktop or phone, alt, caption), role, overview, deliverables, and the story in Markdown (saved as sanitized HTML). Typical: 2 to 15 projects.
- **Primary action:** index: New project. Edit page: Save while there are unsaved edits; on a clean draft, Publish.

## Direction contract

THESIS: A project is one document edited on its own page, and the index is a ruled list of those documents with the actions that don't need the page. It refuses the CMS template of tabs, modals and a WYSIWYG word processor: the story is Markdown that styles itself in place.

OWN-WORLD: The console's Operate register: dark ground, 1px hairlines, radii 4/8/12, Readex Pro for words, JetBrains Mono for slugs, counts, dates and pixel sizes. Violet only on the one primary control of the view. Published is a teal dot badge, Draft a hairline badge; unsaved is the warning dot. Tool logos keep their brand colours (Ram's call), on a dark chip inside violet fields.

STORY: Ram creates a draft from an English title, fills the details, dates, stack, cover, screens and case study, writing the story in an editor that already looks like the case study, saves as he goes, and publishes when the check says both languages are complete. On the index he stars, reorders, publishes or deletes drafts without opening them.

FIRST VIEWPORT: Index: the h1 "Projects" with a one-line count lead, New project on the end side, then ruled rows (grip, 16:9 cover thumb, title with status and Recommended, slug and kind · year in mono, then star, publish, view or delete, Edit). Edit page: a sticky bar (back, title, status, unsaved state, Discard, Save, Publish) over four ruled sections (Details, Dates and stack, Cover and gallery, Case study), mirrored as anchors under Projects in the rail.

FORM: Operate register, inside the established console world: no concept roll. Signature interaction: the Obsidian-style live preview (CodeMirror 6): headings, emphasis, code, quotes, lists, checkboxes, images, rules and tables render in `story-prose` styles, and their Markdown appears only where the caret is. Quick actions save at once with a toast; the edit page keeps one local draft with Discard as the undo. Motion: colour transitions only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
