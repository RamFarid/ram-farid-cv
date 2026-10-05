'use client'

import { Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { AddButton, EmptyList, ListRow, newId, RemoveButton } from '@/components/Console/ListParts'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { SortableList } from '@/components/Console/SortableList'
import { Button } from '@/components/ui/Button'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { TagInput } from '@/components/ui/TagInput'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { saveSkills } from '@/lib/home/actions'
import { homeLimits, skillsZSchema, type SkillsInput } from '@/lib/validations/home'
import { useFieldErrors } from '@/components/Console/fieldErrors'

type Group = SkillsInput['skillGroups'][number]

export function SkillsSection({ initial }: { initial: SkillsInput }) {
  const t = useTranslations('Console.skills')
  const locale = useLocale()
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft('skills', initial, skillsZSchema, saveSkills)
  const fieldError = useFieldErrors(errors)
  const groups = draft.skillGroups

  const setGroups = (change: (groups: Group[]) => Group[]) =>
    update((current) => ({ ...current, skillGroups: change(current.skillGroups) }))
  const setGroup = (id: string, change: (group: Group) => Group) =>
    setGroups((list) => list.map((group) => (group.id === id ? change(group) : group)))
  const label = (group: Group, index: number) => group.name[locale] || t('untitled', { number: index + 1 })

  return (
    <SectionPanel
      id="skills"
      index="05"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={() => save()}
      onDiscard={discard}
    >
      {groups.length === 0 ? (
        <EmptyList>{t('empty')}</EmptyList>
      ) : (
        <SortableList
          items={groups}
          getId={(group) => group.id}
          getLabel={label}
          onReorder={(next) => setGroups(() => next)}
          className="border-t border-line"
          renderItem={(group, index, handle) => (
            <ListRow
              handle={handle}
              index={index}
              removeLabel={t('remove', { name: label(group, index) })}
              onRemove={() => setGroups((list) => list.filter((item) => item.id !== group.id))}
            >
              <div className="grid gap-space-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <LocalizedField
                  id={`group-${group.id}-name`}
                  label={t('name')}
                  value={group.name}
                  maxLength={homeLimits.groupName}
                  onChange={(name) => setGroup(group.id, (current) => ({ ...current, name }))}
                  errors={fieldError.localized(`skillGroups.${index}.name`)}
                />

                <div className="grid content-start gap-space-5">
                  <TagInput
                    id={`group-${group.id}-items`}
                    label={t('items')}
                    value={group.items}
                    max={homeLimits.groupItems}
                    maxLength={homeLimits.tag}
                    placeholder={t('itemsPlaceholder')}
                    hint={t('itemsHint')}
                    onChange={(items) => setGroup(group.id, (current) => ({ ...current, items }))}
                    error={fieldError.one(`skillGroups.${index}.items`)}
                  />

                  <fieldset className="grid gap-space-3">
                    <legend className="mb-space-2 text-label text-ink">{t('practices')}</legend>
                    {group.practices.length === 0 && <p className="text-small text-ink-muted">{t('practicesEmpty')}</p>}
                    {group.practices.map((practice, practiceIndex) => (
                      <div key={practice.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-space-2">
                        <LocalizedField
                          id={`practice-${practice.id}`}
                          label={t('practice', { number: practiceIndex + 1 })}
                          value={practice.label}
                          maxLength={homeLimits.practice}
                          onChange={(value) =>
                            setGroup(group.id, (current) => ({
                              ...current,
                              practices: current.practices.map((item) =>
                                item.id === practice.id ? { ...item, label: value } : item,
                              ),
                            }))
                          }
                          errors={fieldError.localized(`skillGroups.${index}.practices.${practiceIndex}.label`)}
                        />
                        <div className="pt-7">
                          <RemoveButton
                            label={t('removePractice', { name: practice.label[locale] || String(practiceIndex + 1) })}
                            onClick={() =>
                              setGroup(group.id, (current) => ({
                                ...current,
                                practices: current.practices.filter((item) => item.id !== practice.id),
                              }))
                            }
                          />
                        </div>
                      </div>
                    ))}
                    <div>
                      <Button
                        variant="quiet"
                        size="sm"
                        icon={<Plus aria-hidden size={18} strokeWidth={1.75} />}
                        disabled={group.practices.length >= homeLimits.practices}
                        onClick={() =>
                          setGroup(group.id, (current) => ({
                            ...current,
                            practices: [...current.practices, { id: newId(), label: { en: '', ar: '' } }],
                          }))
                        }
                      >
                        {t('addPractice')}
                      </Button>
                    </div>
                  </fieldset>
                </div>
              </div>
            </ListRow>
          )}
        />
      )}

      <AddButton
        label={t('add')}
        full={groups.length >= homeLimits.skillGroups}
        fullNote={t('full', { max: homeLimits.skillGroups })}
        onClick={() => setGroups((list) => [...list, { id: newId(), name: { en: '', ar: '' }, items: [], practices: [] }])}
      />
    </SectionPanel>
  )
}
