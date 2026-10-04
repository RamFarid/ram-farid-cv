# Console messages surface brief

- **Scope:** `/[locale]/console/contact-msgs` and `/[locale]/console/contact-msgs/[msg_id]`, English and Arabic (RTL). Visitor mode: Operate.
- **Audience and job:** Ram, usually arriving from a Telegram notification's "Show in console" button or the rail's new-message count. He reads a message, replies (email or WhatsApp), and files it: read, back to unread, archived, or deleted from the archive.
- **Content:** contact-form submissions (`ContactMsgs`): name, email, optional phone, message (up to 4,000 characters), the visitor's language, status (`new`, `read`, `archived`) and the received time. Expected volume: a few a week; the list shows the latest 200 per filter.
- **Primary action:** Reply by email, prefilled with a subject in the visitor's language.

## Direction contract

THESIS: An inbox that reads like the rest of the console: a ruled list of messages on the start side and the open message on the end side, filed by three plain states. It refuses the help-desk template of tickets, priorities, tags and avatars.

OWN-WORLD: The Ram Farid world in Operate register, as on the console home: dark ground, 1px hairlines, radii 4/8/12, Readex Pro for words, JetBrains Mono for times, counts and locale codes. Violet only on Reply by email and the current rail item. A new message is marked by a `warning` dot (the console's "needs attention" colour, as for unsaved sections) and its sender in full ink; read ones sit in `ink-muted`.

STORY: Ram opens a message from Telegram; it opens marked read. He sees who wrote, how to reach them and when, reads the message at a comfortable measure in its own direction, replies by email or WhatsApp, then archives it or marks it unread to come back to it.

FIRST VIEWPORT: The rail; the h1 "Messages" with the filter row (Inbox: everything not archived, the default; Unread; Archived; each with a mono count); then on lg a two-pane split: the list (about 24rem) and the open message, or a short prompt to pick one. Under lg the index shows only the list and a message page shows only the message, with a back link to the list.

FORM: Operate register, inside the established world: no concept roll. Filters and selection are URLs (`?filter=` and `/[msg_id]`), so the back button, Telegram links and reloads all land on the same view. Opening a new message marks it read after it renders, from the client, never as a side effect of a GET render. Delete exists only in the archive, behind an inline second click. Motion: colour transitions only.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
