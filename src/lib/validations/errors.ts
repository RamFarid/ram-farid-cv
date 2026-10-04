import type { z } from 'zod'

// Console field errors, shared by every console form and its Server Action. Each issue's message is a key of
// `Console.errors`, translated where it is shown. See docs/console.md#saving

export const fieldErrorKeys = ['required', 'tooLong', 'tooMany', 'invalid', 'emptyGroup', 'taken', 'beforeStart'] as const
export type FieldErrorKey = (typeof fieldErrorKeys)[number]

/** Field errors keyed by their dotted path, e.g. `services.2.title.ar`. */
export type FieldErrors = Record<string, FieldErrorKey>

const isErrorKey = (message: string): message is FieldErrorKey => (fieldErrorKeys as readonly string[]).includes(message)

/** The first issue per path, as an error key. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    const path = issue.path.join('.')
    errors[path] ??= isErrorKey(issue.message) ? issue.message : 'invalid'
  }
  return errors
}

/** What a console save returns. Plain and serializable; `value` is the saved draft when the server normalized it. */
export type SaveResult<T = never> =
  | { ok: true; value?: T }
  | { ok: false; error: 'unauthorized' | 'invalid' | 'unavailable'; fieldErrors?: FieldErrors }
