# TextField

A labelled input or textarea for the contact form. The label is always visible (no placeholder-as-label); `hint` sits under the field, and `error` replaces it in `danger` with `aria-invalid` set.

- Provide: `label`; optional `hint`, `error`, `multiline`, `rows`, and any native input props (`type`, `name`, `required`, `placeholder`).
- Errors say what to do: "Enter an email like name@domain.com", not "Invalid input".
- Inputs use logical padding, so they work unchanged in RTL.
