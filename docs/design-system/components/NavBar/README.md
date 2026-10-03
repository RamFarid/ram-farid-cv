# NavBar

The sticky top bar: name, section links, and one action. It floats `space-4` from the viewport edges as a bordered `surface` bar, `nav-height` tall; once the page scrolls it gains `shadow-md`.

- Provide: `name`, optional `logoSrc`, `links` (`{label, href}` — the page's sections, max five), `active` (the current href or label), and an `action` (usually a small primary `Button` "Hire me" or a language switch).
- Brand: pass `logoSrc` (the `ram-icon.svg` url) and `name` "Ram" — in both languages. The word renders Bold 700 in `logo-word`. The full lock-up is too tall for a 64px bar.
- Under 720px links collapse; supply your own menu toggle in `action`.
- RTL: order flips automatically; keep the name first.
