'use client'

import { useTranslations } from 'next-intl'
import { EmptyList, ListRow } from '@/components/Console/ListParts'
import { OptionPicker } from '@/components/Console/OptionPicker'
import { SortableList } from '@/components/Console/SortableList'
import { TextField } from '@/components/ui/TextField'
import { cvLimits, type CvConfigInput } from '@/lib/validations/cv'
import { CvGroup, toggleIn, ToggleChip, type CvFieldsProps } from './parts'

// Technical Skills: groups from the home page's skills, one line each on the CV, in the order set here. Tools left out
// are stored rather than the ones kept, so a tool added to a group later shows by default. See docs/cv.md#setup

type Entry = CvConfigInput['skills'][number]

export function SkillsFields({ config, change, fieldError, sources }: CvFieldsProps) {
  const t = useTranslations('Console.cv')
  const entries = config.skills
  const group = (id: string) => sources.skillGroups.find((item) => item.id === id)
  const available = sources.skillGroups.filter((item) => !entries.some((entry) => entry.groupId === item.id))
  const name = (entry: Entry) => entry.label || group(entry.groupId)?.name || ''

  const setEntries = (next: (entries: Entry[]) => Entry[]) => change((current) => ({ ...current, skills: next(current.skills) }))
  const setEntry = (id: string, next: (entry: Entry) => Entry) =>
    setEntries((list) => list.map((entry) => (entry.groupId === id ? next(entry) : entry)))

  return (
    <CvGroup id="skills" title={t('groups.skills.title')} description={t('groups.skills.description')}>
      <OptionPicker
        id="cv-group-picker"
        label={t('addGroup')}
        placeholder={t('groupSearch')}
        options={available.map((item) => ({ id: item.id, label: item.name }))}
        onPick={(id) => setEntries((list) => [...list, { groupId: id, label: '', hiddenItems: [], hiddenPractices: [] }])}
        noMatch={t('noGroupMatch')}
        disabledNote={available.length === 0 ? t('allGroupsPicked') : undefined}
      />

      {entries.length === 0 ? (
        <EmptyList>{t('skillsEmpty')}</EmptyList>
      ) : (
        <SortableList
          items={entries}
          getId={(entry) => entry.groupId}
          getLabel={name}
          onReorder={(next) => setEntries(() => next)}
          className="border-t border-line"
          renderItem={(entry, index, handle) => {
            const source = group(entry.groupId)
            return (
              <ListRow
                handle={handle}
                index={index}
                removeLabel={t('removeGroup', { name: name(entry) })}
                onRemove={() => setEntries((list) => list.filter((item) => item.groupId !== entry.groupId))}
              >
                <div className="grid gap-space-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                  <TextField
                    label={t('groupLabel')}
                    name={`cv-group-${entry.groupId}-label`}
                    placeholder={source?.name}
                    hint={t('groupLabelHint', { name: source?.name ?? '' })}
                    value={entry.label}
                    maxLength={cvLimits.groupLabel}
                    onChange={(event) => setEntry(entry.groupId, (current) => ({ ...current, label: event.target.value }))}
                    error={fieldError.one(`skills.${index}.label`)}
                    dir="ltr"
                  />

                  <div role="group" aria-labelledby={`cv-group-${entry.groupId}-items`} className="grid content-start gap-space-3">
                    <p id={`cv-group-${entry.groupId}-items`} className="text-label text-ink">
                      {t('groupItems')}
                    </p>
                    <div className="flex flex-wrap gap-space-2" dir="ltr">
                      {source?.items.map((item) => (
                        <ToggleChip
                          key={item}
                          mono
                          pressed={!entry.hiddenItems.includes(item)}
                          onToggle={() => setEntry(entry.groupId, (current) => ({ ...current, hiddenItems: toggleIn(current.hiddenItems, item) }))}
                        >
                          {item}
                        </ToggleChip>
                      ))}
                      {source?.practices.map((practice) => (
                        <ToggleChip
                          key={practice.id}
                          pressed={!entry.hiddenPractices.includes(practice.id)}
                          onToggle={() =>
                            setEntry(entry.groupId, (current) => ({
                              ...current,
                              hiddenPractices: toggleIn(current.hiddenPractices, practice.id),
                            }))
                          }
                        >
                          {practice.label}
                        </ToggleChip>
                      ))}
                    </div>
                    <p className="text-small text-ink-muted">{t('groupItemsHint')}</p>
                  </div>
                </div>
              </ListRow>
            )
          }}
        />
      )}
    </CvGroup>
  )
}
