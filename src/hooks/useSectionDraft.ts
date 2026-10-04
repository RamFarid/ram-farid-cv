'use client'

import { useEffect, useState, useTransition } from 'react'
import { useSetAtom } from 'jotai'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { z } from 'zod'
import type { HomeSaveResult } from '@/lib/home/types'
import { dirtySectionsAtom } from '@/lib/state/console'
import { homeFieldErrors, type HomeFieldErrors, type HomeSection } from '@/lib/validations/home'

/**
 * One console section's draft: edits stay local until Save, Discard returns to what is live, and the section's dirty
 * flag is shared with the rail. The same Zod schema checks the draft here and again in the action.
 */
export function useSectionDraft<T>(
  section: HomeSection,
  initial: T,
  schema: z.ZodType<T>,
  action: (input: T) => Promise<HomeSaveResult>,
) {
  const t = useTranslations('Console.save')
  const [baseline, setBaseline] = useState(initial)
  const [draft, setDraft] = useState(initial)
  // After a failed save the draft is re-checked on every edit, so each message clears as its field is fixed.
  const [checking, setChecking] = useState(false)
  const [serverErrors, setServerErrors] = useState<HomeFieldErrors>({})
  const [pending, startTransition] = useTransition()
  const setDirtySections = useSetAtom(dirtySectionsAtom)
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline)
  const checked = checking ? schema.safeParse(draft) : null
  const errors: HomeFieldErrors = { ...serverErrors, ...(checked && !checked.success ? homeFieldErrors(checked.error) : {}) }

  useEffect(() => {
    setDirtySections((current) => {
      if (current.has(section) === dirty) return current
      const next = new Set(current)
      if (dirty) next.add(section)
      else next.delete(section)
      return next
    })
  }, [dirty, section, setDirtySections])

  const update = (next: T | ((current: T) => T)) => {
    setDraft(next)
    setServerErrors({})
  }

  const save = () => {
    const parsed = schema.safeParse(draft)
    if (!parsed.success) {
      setChecking(true)
      toast.error(t('invalid'))
      return
    }

    startTransition(async () => {
      try {
        const result = await action(draft)
        if (result.ok) {
          setBaseline(draft)
          setChecking(false)
          toast.success(t('saved'))
        } else {
          setServerErrors(result.fieldErrors ?? {})
          toast.error(t(result.error))
        }
      } catch {
        toast.error(t('unavailable'))
      }
    })
  }

  const discard = () => {
    setDraft(baseline)
    setChecking(false)
    setServerErrors({})
  }

  return { draft, update, errors, dirty, pending, save, discard }
}
