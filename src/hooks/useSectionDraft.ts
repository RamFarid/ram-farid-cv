'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { z } from 'zod'
import { dirtySectionsAtom } from '@/lib/state/console'
import { toFieldErrors, type FieldErrors, type SaveResult } from '@/lib/validations/errors'

type SaveOptions<T> = {
  /** Another action for this save (e.g. save and publish), checked against its own schema first. */
  action?: (input: T) => Promise<SaveResult<T>>
  schema?: z.ZodType<T>
  /** The toast on success, instead of "Saved". */
  success?: string
  /** The toast when the draft fails the check, instead of the generic one. */
  invalid?: string
  onSaved?: () => void
}

/**
 * One console draft: edits stay local until Save, Discard returns to what is live, and the draft's dirty flag is
 * shared with the rail under `key`. The same Zod schema checks the draft here and again in the action.
 */
export function useSectionDraft<T>(
  key: string,
  initial: T,
  schema: z.ZodType<T>,
  action: (input: T) => Promise<SaveResult<T>>,
) {
  const t = useTranslations('Console.save')
  const [baseline, setBaseline] = useState(initial)
  const [draft, setDraft] = useState(initial)
  // After a failed save the draft is re-checked on every edit, so each message clears as its field is fixed.
  const [checkWith, setCheckWith] = useState<z.ZodType<T> | null>(null)
  const [serverErrors, setServerErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()
  const setDirtySections = useSetAtom(dirtySectionsAtom)
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline)
  const checked = checkWith ? checkWith.safeParse(draft) : null
  const errors: FieldErrors = { ...serverErrors, ...(checked && !checked.success ? toFieldErrors(checked.error) : {}) }

  useEffect(() => {
    setDirtySections((current) => {
      if (current.has(key) === dirty) return current
      const next = new Set(current)
      if (dirty) next.add(key)
      else next.delete(key)
      return next
    })
  }, [dirty, key, setDirtySections])

  // Leaving the page (or this editor unmounting) clears its flag.
  useEffect(
    () => () =>
      setDirtySections((current) => {
        if (!current.has(key)) return current
        const next = new Set(current)
        next.delete(key)
        return next
      }),
    [key, setDirtySections],
  )

  const update = (next: T | ((current: T) => T)) => {
    setDraft(next)
    setServerErrors({})
  }

  const save = (options: SaveOptions<T> = {}) => {
    const check = options.schema ?? schema
    const parsed = check.safeParse(draft)
    if (!parsed.success) {
      setCheckWith(() => check)
      toast.error(options.invalid ?? t('invalid'))
      return
    }

    startTransition(async () => {
      try {
        const result = await (options.action ?? action)(draft)
        if (result.ok) {
          const saved = result.value ?? draft
          setBaseline(saved)
          setDraft(saved)
          setCheckWith(null)
          toast.success(options.success ?? t('saved'))
          options.onSaved?.()
        } else {
          setServerErrors(result.fieldErrors ?? {})
          if (result.fieldErrors) setCheckWith(() => check)
          toast.error(result.error === 'invalid' && options.invalid ? options.invalid : t(result.error))
        }
      } catch {
        toast.error(t('unavailable'))
      }
    })
  }

  const discard = () => {
    setDraft(baseline)
    setCheckWith(null)
    setServerErrors({})
  }

  return { draft, update, errors, dirty, pending, save, discard }
}
