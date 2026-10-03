# Button

Triggers an action or navigates; three variants. **Primary** (violet fill, `on-primary` label) at most once per view — the thing the page is for ("Hire me", "Send message"). **Secondary** (outlined in `line-strong`) for the alternative ("View GitHub"). **Ghost** (`primary-ink` text) for low-weight inline actions ("See all projects").

- Provide: `children` (the label), optional `variant`, `size`, `arrow`, `href`.
- Labels: verb first, sentence case, two or three words. Arabic labels the same, no tracking.
- `arrow` adds a trailing arrow that mirrors automatically under `dir="rtl"`.
- `href` renders a real `<a>`; use it for navigation, never `onClick` + `location`.
- Don't put two primary buttons side by side; don't use white text on `primary`.
