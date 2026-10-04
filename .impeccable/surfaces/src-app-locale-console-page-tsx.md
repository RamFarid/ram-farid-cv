# Console home surface brief

- **Scope:** `/[locale]/console` (the console's main page) and `/[locale]/console/sign-in`, English and Arabic (RTL). Visitor mode: Operate.
- **Audience and job:** Ram alone, signed in, mostly on a laptop, sometimes on a phone. He changes what the home page says without touching code, and jumps to Messages and Projects.
- **Content (Ram, 2026-10-04):** About (title, body, the client count, the portrait; years and live projects are computed and shown read-only), Services (ordered title → description pairs), Skills (ordered groups: a name, tech-name tags, translated practices), Certifications (image, name, issuer, issue month, description, up to four skill tags). Every text field is entered in English and Arabic through the multi-language input.
- **Saving:** each section saves on its own and revalidates the public home page in both languages.
- **Open:** real certificates, the portrait, confirmed Services copy (waiting on Ram).

## Direction contract

THESIS: The console is the home page's back office, laid out in the home page's own order. A sticky rail names each section by its home-page index (02 About to 05 Certifications) and marks unsaved ones; each section is one ruled panel with its own save. It refuses the admin-template default of a card grid of widgets, charts and a modal per edit.

OWN-WORLD: The Ram Farid world, in Operate register. Dark ground, `surface` panels split by 1px hairlines, radii 4/8/12, Readex Pro for words and JetBrains Mono for indexes, counts, locale codes and tags. Violet only on the one pending Save (a clean section's Save is a disabled secondary) and on the current rail item. No eyebrows above headings: the index sits inline before the section name, because it maps each panel to its home-page section.

STORY: Ram lands on the page, sees new messages and project drafts in the rail, edits a section, sees its rail dot appear, saves it (a toast confirms and the live page updates), or discards back to what is live.

FIRST VIEWPORT: The rail on the start side (brand; Home page with its four section anchors nested under it; Messages with the new-message count; Projects with published and draft counts; then View site, the language switch and Sign out). Home page is a peer of Messages and Projects, so the rail reads the same on every console page (changed from Messages and Projects first during the build, 2026-10-04). On the end side: the h1 "Home page" with a one-line lead, then the About panel with its sticky header (index, name, status, Discard, Save) and the title and body fields. On phones the rail becomes a top block with the three managers, a scrolling row of section anchors (with unsaved dots), and View site, language and Sign out.

FORM: Operate register, inside the established world: no concept roll, the structure follows the home page's section order. Sticky section headers keep each Save reachable inside long sections. The multi-language input carries a mono locale code at its end that opens a native popover with the other languages and a filled or missing dot for each; Arabic flips the field to RTL. Lists reorder with a drag handle that also answers ArrowUp and ArrowDown. Removing an item only changes the draft, so Discard is the undo, with no confirm dialogs. While a section is unsaved, rail links navigate the whole document so the browser's leave-page prompt guards the drafts. Secondary actions (Discard, add-practice, image Remove) use the neutral `quiet` button so violet stays on the pending Save. Motion: 120 to 200ms colour and border transitions, nothing choreographed.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
