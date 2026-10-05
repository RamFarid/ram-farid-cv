'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EmptyList, ListRow, newId, RemoveButton } from '@/components/Console/ListParts'
import { OptionPicker } from '@/components/Console/OptionPicker'
import { SortableList } from '@/components/Console/SortableList'
import { Button } from '@/components/ui/Button'
import { TagInput } from '@/components/ui/TagInput'
import { TextArea, TextField } from '@/components/ui/TextField'
import { cvLimits, type CvConfigInput } from '@/lib/validations/cv'
import { CvGroup, type CvFieldsProps } from './parts'

// Selected Projects: picked from every project (drafts too) and ordered by hand. The bullets are written for the CV
// alone; the case study's deliverables stay as they are. See docs/cv.md#setup

type Entry = CvConfigInput['projects'][number]

export function ProjectsFields({ config, change, fieldError, sources }: CvFieldsProps) {
  const t = useTranslations('Console.cv')
  const entries = config.projects
  const full = entries.length >= cvLimits.projects
  const available = sources.projects.filter((project) => !entries.some((entry) => entry.projectId === project.id))
  const project = (id: string) => sources.projects.find((item) => item.id === id)
  const name = (entry: Entry) => entry.title || project(entry.projectId)?.title || ''

  const setEntries = (next: (entries: Entry[]) => Entry[]) => change((current) => ({ ...current, projects: next(current.projects) }))
  const setEntry = (id: string, next: (entry: Entry) => Entry) =>
    setEntries((list) => list.map((entry) => (entry.projectId === id ? next(entry) : entry)))

  const add = (id: string) => {
    const picked = project(id)
    if (!picked) return
    setEntries((list) => [
      ...list,
      {
        projectId: id,
        title: '',
        links: [picked.liveUrl, picked.repoUrl].filter((url): url is string => Boolean(url)),
        bullets: [{ id: newId(), text: '' }],
      },
    ])
  }

  return (
    <CvGroup id="projects" title={t('groups.projects.title')} description={t('groups.projects.description')}>
      <OptionPicker
        id="cv-project-picker"
        label={t('addProject')}
        placeholder={t('projectSearch')}
        options={available.map((item) => ({
          id: item.id,
          label: item.title,
          meta: item.status === 'draft' ? t('draft') : undefined,
        }))}
        onPick={add}
        noMatch={t('noProjectMatch')}
        disabledNote={
          full ? t('projectsFull', { max: cvLimits.projects }) : available.length === 0 ? t('allProjectsPicked') : undefined
        }
      />

      {entries.length === 0 ? (
        <EmptyList>{t('projectsEmpty')}</EmptyList>
      ) : (
        <SortableList
          items={entries}
          getId={(entry) => entry.projectId}
          getLabel={name}
          onReorder={(next) => setEntries(() => next)}
          className="border-t border-line"
          renderItem={(entry, index, handle) => {
            const path = `projects.${index}`
            const source = project(entry.projectId)
            return (
              <ListRow
                handle={handle}
                index={index}
                removeLabel={t('removeProject', { name: name(entry) })}
                onRemove={() => setEntries((list) => list.filter((item) => item.projectId !== entry.projectId))}
              >
                <div className="grid content-start gap-space-5">
                  <div className="grid gap-space-4 lg:grid-cols-2 lg:items-start">
                    <TextField
                      label={t('projectTitle')}
                      name={`cv-project-${entry.projectId}-title`}
                      placeholder={source?.title}
                      hint={t('projectTitleHint', { title: source?.title ?? '' })}
                      value={entry.title}
                      maxLength={cvLimits.projectTitle}
                      onChange={(event) => setEntry(entry.projectId, (current) => ({ ...current, title: event.target.value }))}
                      error={fieldError.one(`${path}.title`)}
                      dir="ltr"
                    />
                    <TagInput
                      id={`cv-project-${entry.projectId}-links`}
                      label={t('links')}
                      value={entry.links}
                      max={cvLimits.projectLinks}
                      maxLength={cvLimits.url}
                      placeholder={t('linksPlaceholder')}
                      hint={t('linksHint')}
                      onChange={(links) => setEntry(entry.projectId, (current) => ({ ...current, links }))}
                      error={
                        fieldError.one(`${path}.links`) ??
                        entry.links.map((_, linkIndex) => fieldError.one(`${path}.links.${linkIndex}`)).find(Boolean)
                      }
                    />
                  </div>

                  <fieldset className="grid gap-space-3">
                    <legend className="mb-space-2 flex w-full items-baseline justify-between gap-space-3 text-label text-ink">
                      {t('bullets')}
                      <span className="font-mono text-code text-ink-muted" dir="ltr">
                        {entry.bullets.length} / {cvLimits.projectBullets}
                      </span>
                    </legend>
                    {entry.bullets.length === 0 && <p className="text-small text-ink-muted">{t('bulletsEmpty')}</p>}
                    {entry.bullets.map((bullet, bulletIndex) => (
                      <div key={bullet.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-space-2">
                        <TextArea
                          label={t('bullet', { number: bulletIndex + 1 })}
                          name={`cv-bullet-${bullet.id}`}
                          rows={2}
                          value={bullet.text}
                          maxLength={cvLimits.projectBullet}
                          onChange={(event) =>
                            setEntry(entry.projectId, (current) => ({
                              ...current,
                              bullets: current.bullets.map((item) => (item.id === bullet.id ? { ...item, text: event.target.value } : item)),
                            }))
                          }
                          error={fieldError.one(`${path}.bullets.${bulletIndex}.text`)}
                          dir="ltr"
                        />
                        <div className="pt-7">
                          <RemoveButton
                            label={t('removeBullet', { number: bulletIndex + 1 })}
                            onClick={() =>
                              setEntry(entry.projectId, (current) => ({
                                ...current,
                                bullets: current.bullets.filter((item) => item.id !== bullet.id),
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
                        disabled={entry.bullets.length >= cvLimits.projectBullets}
                        onClick={() =>
                          setEntry(entry.projectId, (current) => ({
                            ...current,
                            bullets: [...current.bullets, { id: newId(), text: '' }],
                          }))
                        }
                      >
                        {t('addBullet')}
                      </Button>
                    </div>
                  </fieldset>
                </div>
              </ListRow>
            )
          }}
        />
      )}
    </CvGroup>
  )
}
