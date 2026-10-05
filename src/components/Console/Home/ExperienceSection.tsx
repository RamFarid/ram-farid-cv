'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useFieldErrors } from '@/components/Console/fieldErrors'
import { AddButton, EmptyList, ListRow, newId, RemoveButton } from '@/components/Console/ListParts'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { Button } from '@/components/ui/Button'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { controlClasses, TextField } from '@/components/ui/TextField'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { saveExperience } from '@/lib/home/actions'
import { experienceZSchema, homeLimits, type ExperienceInput } from '@/lib/validations/home'
import { cn } from '@/utils'

// The roles on the home page's experience timeline. Order comes from the dates: a save sorts the list oldest first, so
// there's no drag handle. The university isn't listed: the timeline builds it from lib/profile. See docs/home.md#experience

type Entry = ExperienceInput['experience'][number]
type ProjectOption = { id: string; title: string }

const thisMonth = () => new Date().toISOString().slice(0, 7)

export function ExperienceSection({ initial, projects }: { initial: ExperienceInput; projects: ProjectOption[] }) {
  const t = useTranslations('Console.experience')
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft(
    'experience',
    initial,
    experienceZSchema,
    saveExperience,
  )
  const fieldError = useFieldErrors(errors)
  const entries = draft.experience

  const setEntries = (change: (entries: Entry[]) => Entry[]) =>
    update((current) => ({ ...current, experience: change(current.experience) }))
  const setEntry = (id: string, change: (entry: Entry) => Entry) =>
    setEntries((list) => list.map((entry) => (entry.id === id ? change(entry) : entry)))
  const label = (entry: Entry, index: number) => entry.organization || t('untitled', { number: index + 1 })

  return (
    <SectionPanel
      id="experience"
      index="03"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={() => save()}
      onDiscard={discard}
    >
      {entries.length === 0 ? (
        <EmptyList>{t('empty')}</EmptyList>
      ) : (
        <div className="border-t border-line">
          {entries.map((entry, index) => {
            const path = `experience.${index}`
            const ongoing = entry.endedOn === ''
            return (
              <ListRow
                key={entry.id}
                handle={null}
                index={index}
                removeLabel={t('remove', { name: label(entry, index) })}
                onRemove={() => setEntries((list) => list.filter((item) => item.id !== entry.id))}
              >
                <div className="grid content-start gap-space-5">
                  <div className="grid gap-space-4 md:grid-cols-2">
                    <LocalizedField
                      id={`experience-${entry.id}-role`}
                      label={t('role')}
                      value={entry.role}
                      maxLength={homeLimits.experienceRole}
                      onChange={(role) => setEntry(entry.id, (current) => ({ ...current, role }))}
                      errors={fieldError.localized(`${path}.role`)}
                    />
                    <TextField
                      label={t('organization')}
                      name={`experience-${entry.id}-organization`}
                      hint={t('organizationHint')}
                      value={entry.organization}
                      maxLength={homeLimits.experienceOrganization}
                      onChange={(event) => setEntry(entry.id, (current) => ({ ...current, organization: event.target.value }))}
                      error={fieldError.one(`${path}.organization`)}
                      dir="auto"
                    />
                  </div>

                  <div className="grid gap-space-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)] lg:items-start">
                    <TextField
                      label={t('startedOn')}
                      name={`experience-${entry.id}-started`}
                      type="month"
                      value={entry.startedOn}
                      onChange={(event) => setEntry(entry.id, (current) => ({ ...current, startedOn: event.target.value }))}
                      error={fieldError.one(`${path}.startedOn`)}
                      dir="ltr"
                    />
                    <TextField
                      label={t('endedOn')}
                      name={`experience-${entry.id}-ended`}
                      type="month"
                      value={entry.endedOn}
                      disabled={ongoing}
                      hint={ongoing ? t('endedOnOngoing') : undefined}
                      onChange={(event) => setEntry(entry.id, (current) => ({ ...current, endedOn: event.target.value }))}
                      error={fieldError.one(`${path}.endedOn`)}
                      dir="ltr"
                    />
                    <label className="flex cursor-pointer items-start gap-space-3 rounded-md border border-line p-space-4 transition-colors hover:border-line-strong has-checked:border-line-strong has-checked:bg-surface sm:col-span-2 lg:col-span-1 lg:mt-7">
                      <input
                        type="checkbox"
                        checked={ongoing}
                        onChange={(event) =>
                          setEntry(entry.id, (current) => ({ ...current, endedOn: event.target.checked ? '' : thisMonth() }))
                        }
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className="grid gap-space-1">
                        <span className="text-label text-ink">{t('ongoing')}</span>
                        <span className="text-small text-ink-muted">{t('ongoingHint')}</span>
                      </span>
                    </label>
                  </div>

                  <LocalizedField
                    id={`experience-${entry.id}-summary`}
                    label={t('summary')}
                    multiline
                    rows={2}
                    value={entry.summary}
                    maxLength={homeLimits.experienceSummary}
                    onChange={(summary) => setEntry(entry.id, (current) => ({ ...current, summary }))}
                    errors={fieldError.localized(`${path}.summary`)}
                  />

                  <fieldset className="grid gap-space-3">
                    <legend className="mb-space-2 text-label text-ink">{t('highlights')}</legend>
                    {entry.highlights.length === 0 && <p className="text-small text-ink-muted">{t('highlightsEmpty')}</p>}
                    {entry.highlights.map((highlight, highlightIndex) => (
                      <div key={highlight.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-space-2">
                        <LocalizedField
                          id={`highlight-${highlight.id}`}
                          label={t('highlight', { number: highlightIndex + 1 })}
                          multiline
                          rows={2}
                          value={highlight.text}
                          maxLength={homeLimits.experienceHighlight}
                          onChange={(text) =>
                            setEntry(entry.id, (current) => ({
                              ...current,
                              highlights: current.highlights.map((item) => (item.id === highlight.id ? { ...item, text } : item)),
                            }))
                          }
                          errors={fieldError.localized(`${path}.highlights.${highlightIndex}.text`)}
                        />
                        <div className="pt-7">
                          <RemoveButton
                            label={t('removeHighlight', { number: highlightIndex + 1 })}
                            onClick={() =>
                              setEntry(entry.id, (current) => ({
                                ...current,
                                highlights: current.highlights.filter((item) => item.id !== highlight.id),
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
                        disabled={entry.highlights.length >= homeLimits.experienceHighlights}
                        onClick={() =>
                          setEntry(entry.id, (current) => ({
                            ...current,
                            highlights: [...current.highlights, { id: newId(), text: { en: '', ar: '' } }],
                          }))
                        }
                      >
                        {t('addHighlight')}
                      </Button>
                    </div>
                  </fieldset>

                  <div className="grid gap-space-4 md:grid-cols-2">
                    <TextField
                      label={t('url')}
                      name={`experience-${entry.id}-url`}
                      type="url"
                      inputMode="url"
                      placeholder="https://"
                      hint={t('urlHint')}
                      value={entry.url}
                      onChange={(event) => setEntry(entry.id, (current) => ({ ...current, url: event.target.value.trim() }))}
                      error={fieldError.one(`${path}.url`)}
                      dir="ltr"
                    />
                    <div className="grid content-start gap-space-2">
                      <label htmlFor={`experience-${entry.id}-project`} className="text-label text-ink">
                        {t('project')}
                      </label>
                      <select
                        id={`experience-${entry.id}-project`}
                        value={entry.projectId}
                        onChange={(event) => setEntry(entry.id, (current) => ({ ...current, projectId: event.target.value }))}
                        aria-describedby={`experience-${entry.id}-project-hint`}
                        className={cn(controlClasses, 'h-11')}
                      >
                        <option value="">{t('noProject')}</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                      <p id={`experience-${entry.id}-project-hint`} className="text-small text-ink-muted">
                        {t('projectHint')}
                      </p>
                    </div>
                  </div>
                </div>
              </ListRow>
            )
          })}
        </div>
      )}

      <AddButton
        label={t('add')}
        full={entries.length >= homeLimits.experience}
        fullNote={t('full', { max: homeLimits.experience })}
        onClick={() =>
          setEntries((list) => [
            ...list,
            {
              id: newId(),
              role: { en: '', ar: '' },
              organization: '',
              url: '',
              startedOn: thisMonth(),
              endedOn: '',
              summary: { en: '', ar: '' },
              highlights: [],
              projectId: '',
            },
          ])
        }
      />
    </SectionPanel>
  )
}
