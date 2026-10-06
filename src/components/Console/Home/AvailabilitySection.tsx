'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { saveAvailability } from '@/lib/profile/actions'
import { availabilityZSchema, workTypes, type AvailabilityInput } from '@/lib/validations/profile'

// The kinds of work Ram is open to: the home page's badge, its FAQ answers and llms.txt follow it.
// See docs/console.md#availability
export function AvailabilitySection({ initial, saved }: { initial: AvailabilityInput; saved: boolean }) {
  const t = useTranslations('Console.availability')
  const tAvailability = useTranslations('Profile.availability')
  const format = useFormatter()
  const { draft, update, dirty, pending, save, discard } = useSectionDraft(
    'availability',
    initial,
    availabilityZSchema,
    saveAvailability,
  )

  const toggle = (type: AvailabilityInput['workTypes'][number]) =>
    update((current) => ({
      workTypes: workTypes.filter((item) => (item === type) !== current.workTypes.includes(item)),
    }))

  const badge = draft.workTypes.length
    ? tAvailability('badge', {
        types: format.list(
          draft.workTypes.map((type) => tAvailability(`types.${type}`)),
          { type: 'conjunction' },
        ),
      })
    : null

  return (
    <SectionPanel
      id="availability"
      index="01"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={() => save()}
      onDiscard={discard}
    >
      <fieldset className="grid gap-space-3">
        <legend className="mb-space-2 text-label text-ink">{t('legend')}</legend>
        <div className="flex flex-wrap gap-space-2">
          {workTypes.map((type) => (
            <label
              key={type}
              className="flex h-10 cursor-pointer items-center gap-space-2 rounded-md border border-line px-space-4 text-small text-ink transition-colors hover:border-line-strong has-checked:border-primary has-checked:bg-primary-soft has-checked:text-primary-ink"
            >
              <input
                type="checkbox"
                checked={draft.workTypes.includes(type)}
                onChange={() => toggle(type)}
                className="size-4 accent-primary"
              />
              {t(`types.${type}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-space-1">
        <p className="text-body text-ink">{badge ? t('preview', { badge }) : t('previewNone')}</p>
        {!saved && <p className="text-small text-warning">{t('unsaved')}</p>}
      </div>
    </SectionPanel>
  )
}
