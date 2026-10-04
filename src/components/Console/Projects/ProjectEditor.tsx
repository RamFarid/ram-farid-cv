'use client'

import { useState, useTransition, type ReactNode } from 'react'
import { ArrowLeft, ExternalLink, LoaderCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useFieldErrors } from '@/components/Console/fieldErrors'
import { ImageUpload } from '@/components/Console/ImageUpload'
import { AddButton, EmptyList, ListRow, newId } from '@/components/Console/ListParts'
import { MarkdownField } from '@/components/Console/Markdown/MarkdownField'
import { SortableList } from '@/components/Console/SortableList'
import { Button } from '@/components/ui/Button'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { TextField } from '@/components/ui/TextField'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { Link } from '@/i18n/navigation'
import { saveAndPublishProject, saveProjectDraft, setProjectPublished } from '@/lib/projects/actions'
import type { ConsoleProject } from '@/lib/projects/types'
import {
  projectDraftZSchema,
  projectLimits,
  projectPublishZSchema,
  type ProjectInput,
  type ProjectStatus,
} from '@/lib/validations/project'
import { GalleryField } from './GalleryField'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { StackPicker } from './StackPicker'

// /console/portfolio/[project_id]: one project as a single draft, saved or published from the sticky bar. A published
// project's edits are checked like a publish, so what's live is always complete. See docs/portfolio.md#console

/** A URL path inside translated copy: mono, and isolated so it keeps its order in Arabic. */
const isolatedPath = (chunks: ReactNode) => (
  <bdi dir="ltr" className="font-mono text-code">
    {chunks}
  </bdi>
)

function EditorSection({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="grid scroll-mt-28 gap-space-6 border-t border-line py-space-7 first:border-t-0">
      <div className="grid max-w-measure gap-space-2">
        <h2 id={`${id}-title`} className="text-h3 text-ink">
          {title}
        </h2>
        <p className="text-body text-ink-muted">{description}</p>
      </div>
      {children}
    </section>
  )
}

export function ProjectEditor({ project }: { project: ConsoleProject }) {
  const t = useTranslations('Console.project')
  const tSave = useTranslations('Console.save')
  const locale = useLocale()
  const [status, setStatus] = useState<ProjectStatus>(project.status)
  const [liveSlug, setLiveSlug] = useState(project.input.slug)
  const [flagPending, startFlag] = useTransition()
  const published = status === 'published'
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft(
    'project',
    project.input,
    published ? projectPublishZSchema : projectDraftZSchema,
    (input) => saveProjectDraft(project.id, input),
  )
  const fieldError = useFieldErrors(errors)
  const busy = pending || flagPending
  const title = draft.title[locale as 'en' | 'ar'] || draft.title.en || t('untitled')

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => update((current) => ({ ...current, [key]: value }))
  const setDeliverables = (change: (rows: ProjectInput['deliverables']) => ProjectInput['deliverables']) =>
    update((current) => ({ ...current, deliverables: change(current.deliverables) }))

  const publish = () =>
    save({
      action: (input) => saveAndPublishProject(project.id, input),
      schema: projectPublishZSchema,
      success: t('toasts.published'),
      invalid: t('toasts.publishInvalid'),
      onSaved: () => {
        setStatus('published')
        setLiveSlug(draft.slug)
      },
    })

  const saveDraft = () =>
    save({
      success: published ? t('toasts.savedLive') : t('toasts.savedDraft'),
      onSaved: () => published && setLiveSlug(draft.slug),
    })

  const unpublish = () =>
    startFlag(async () => {
      const result = await setProjectPublished(project.id, false).catch(() => ({ ok: false as const, error: 'unavailable' as const }))
      if (result.ok) {
        setStatus('draft')
        toast.success(t('toasts.unpublished'))
      } else toast.error(tSave(result.error === 'unauthorized' ? 'unauthorized' : 'unavailable'))
    })

  return (
    <div className="mx-auto max-w-page">
      <header className="sticky top-0 z-30 -mx-space-4 flex flex-wrap items-center gap-x-space-4 gap-y-space-3 border-b border-line bg-bg px-space-4 py-space-4 md:-mx-space-6 md:px-space-6 lg:-mx-space-7 lg:px-space-7">
        <div className="flex min-w-0 flex-1 basis-72 items-center gap-space-3">
          <Link
            href="/console/portfolio"
            aria-label={t('back')}
            title={t('back')}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            <ArrowLeft aria-hidden size={18} strokeWidth={1.75} className="rtl:-scale-x-100" />
          </Link>
          <h1 className="min-w-0 truncate text-h3 text-ink">{title}</h1>
          <ProjectStatusBadge status={status} />
        </div>

        <div className="flex flex-wrap items-center gap-space-2">
          <p aria-live="polite" className="text-small text-ink-muted">
            {busy ? (
              <span className="inline-flex items-center gap-space-2">
                <LoaderCircle aria-hidden size={16} strokeWidth={1.75} className="animate-spin motion-reduce:animate-none" />
                {tSave('saving')}
              </span>
            ) : dirty ? (
              <span className="inline-flex items-center gap-space-2 text-warning">
                <span aria-hidden className="size-1.5 rounded-full bg-warning" />
                {tSave('unsaved')}
              </span>
            ) : null}
          </p>
          <Button variant="quiet" size="sm" disabled={!dirty || busy} onClick={discard}>
            {tSave('discard')}
          </Button>
          {published ? (
            <>
              <Button variant="quiet" size="sm" disabled={busy} onClick={unpublish}>
                {t('unpublish')}
              </Button>
              {!dirty && (
                <a
                  href={`/${locale}/portfolio/${liveSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-space-2 rounded-md border border-line-strong px-space-4 text-label text-ink transition-colors hover:border-ink-muted hover:bg-surface-raised"
                >
                  <ExternalLink aria-hidden size={16} strokeWidth={1.75} />
                  {t('view')}
                  <span className="sr-only">{t('newTab')}</span>
                </a>
              )}
              <Button variant={dirty ? 'primary' : 'secondary'} size="sm" disabled={!dirty || busy} onClick={saveDraft}>
                {tSave('save')}
              </Button>
            </>
          ) : (
            <>
              <Button variant={dirty ? 'primary' : 'secondary'} size="sm" disabled={!dirty || busy} onClick={saveDraft}>
                {t('saveDraft')}
              </Button>
              <Button variant={dirty ? 'secondary' : 'primary'} size="sm" disabled={busy} onClick={publish}>
                {dirty ? t('saveAndPublish') : t('publish')}
              </Button>
            </>
          )}
        </div>
      </header>

      <EditorSection id="details" title={t('sections.details')} description={t('descriptions.details')}>
        <div className="grid gap-space-5 md:grid-cols-2">
          <LocalizedField
            id="project-title"
            label={t('fields.title')}
            value={draft.title}
            maxLength={projectLimits.title}
            onChange={(value) => set('title', value)}
            errors={fieldError.localized('title')}
          />
          <LocalizedField
            id="project-kind"
            label={t('fields.kind')}
            hint={t('hints.kind')}
            value={draft.kind}
            maxLength={projectLimits.kind}
            onChange={(value) => set('kind', value)}
            errors={fieldError.localized('kind')}
          />
          <LocalizedField
            id="project-client"
            label={t('fields.client')}
            value={draft.client}
            maxLength={projectLimits.client}
            onChange={(value) => set('client', value)}
            errors={fieldError.localized('client')}
          />
          <TextField
            label={t('fields.slug')}
            name="project-slug"
            dir="ltr"
            value={draft.slug}
            maxLength={projectLimits.slug}
            onChange={(event) => set('slug', event.target.value.toLowerCase())}
            hint={
              published && draft.slug !== liveSlug
                ? t.rich('hints.slugChanged', { slug: liveSlug, path: isolatedPath })
                : t.rich('hints.slug', { path: `/portfolio/${draft.slug || '…'}`, code: isolatedPath })
            }
            error={fieldError.one('slug')}
            controlClassName="font-mono text-code"
          />
        </div>
        <LocalizedField
          id="project-summary"
          label={t('fields.summary')}
          hint={t('hints.summary')}
          multiline
          rows={2}
          value={draft.summary}
          maxLength={projectLimits.summary}
          onChange={(value) => set('summary', value)}
          errors={fieldError.localized('summary')}
        />
        <div className="grid gap-space-5 md:grid-cols-2">
          <TextField
            label={t('fields.liveUrl')}
            name="project-live"
            type="url"
            dir="ltr"
            placeholder="https://"
            value={draft.liveUrl}
            onChange={(event) => set('liveUrl', event.target.value.trim())}
            error={fieldError.one('liveUrl')}
          />
          <TextField
            label={t('fields.repoUrl')}
            name="project-repo"
            type="url"
            dir="ltr"
            placeholder="https://github.com/…"
            hint={t('hints.repoUrl')}
            value={draft.repoUrl}
            onChange={(event) => set('repoUrl', event.target.value.trim())}
            error={fieldError.one('repoUrl')}
          />
        </div>
        <label className="flex max-w-measure cursor-pointer items-start gap-space-3 rounded-md border border-line p-space-4 transition-colors hover:border-line-strong has-checked:border-line-strong has-checked:bg-surface">
          <input
            type="checkbox"
            checked={draft.starred}
            onChange={(event) => set('starred', event.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-primary"
          />
          <span className="grid gap-space-1">
            <span className="text-label text-ink">{t('fields.starred')}</span>
            <span className="text-small text-ink-muted">{t('hints.starred')}</span>
          </span>
        </label>
      </EditorSection>

      <EditorSection id="timeline" title={t('sections.timeline')} description={t('descriptions.timeline')}>
        <div className="grid max-w-2xl gap-space-5 sm:grid-cols-2">
          <TextField
            label={t('fields.startedAt')}
            name="project-started"
            type="date"
            dir="ltr"
            value={draft.startedAt}
            onChange={(event) => set('startedAt', event.target.value)}
            error={fieldError.one('startedAt')}
          />
          <TextField
            label={t('fields.endedAt')}
            name="project-ended"
            type="date"
            dir="ltr"
            value={draft.endedAt}
            onChange={(event) => set('endedAt', event.target.value)}
            error={fieldError.one('endedAt')}
            hint={draft.endedAt ? undefined : t('hints.ongoing')}
          />
        </div>
        <StackPicker
          id="project-stack"
          label={t('fields.stack')}
          value={draft.stack}
          max={projectLimits.stack}
          onChange={(value) => set('stack', value)}
          error={fieldError.one('stack')}
        />
      </EditorSection>

      <EditorSection id="media" title={t('sections.media')} description={t('descriptions.media')}>
        <div className="grid gap-space-5 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <ImageUpload
            label={t('fields.cover')}
            folder="projects/covers"
            aspect="video"
            value={draft.cover}
            onChange={(image) =>
              set('cover', image ? { ...image, alt: draft.cover?.alt ?? { en: '', ar: '' } } : null)
            }
            error={fieldError.one('cover')}
          />
          <div className="grid content-start gap-space-4 md:pt-space-7">
            <LocalizedField
              id="project-cover-alt"
              label={t('fields.coverAlt')}
              hint={draft.cover ? t('hints.coverAlt') : t('hints.coverAltEmpty')}
              value={draft.cover?.alt ?? { en: '', ar: '' }}
              maxLength={projectLimits.alt}
              onChange={(alt) => draft.cover && set('cover', { ...draft.cover, alt })}
              errors={fieldError.localized('cover.alt')}
            />
          </div>
        </div>
        <GalleryField
          value={draft.screenshots}
          onChange={(change) => update((current) => ({ ...current, screenshots: change(current.screenshots) }))}
          error={fieldError.one}
          localizedError={fieldError.localized}
          listError={fieldError.one('screenshots')}
        />
      </EditorSection>

      <EditorSection id="story" title={t('sections.story')} description={t('descriptions.story')}>
        <div className="grid gap-space-5 md:grid-cols-2">
          <LocalizedField
            id="project-role"
            label={t('fields.role')}
            hint={t('hints.role')}
            value={draft.role}
            maxLength={projectLimits.role}
            onChange={(value) => set('role', value)}
            errors={fieldError.localized('role')}
          />
        </div>
        <LocalizedField
          id="project-overview"
          label={t('fields.overview')}
          hint={t('hints.overview')}
          multiline
          rows={5}
          value={draft.overview}
          maxLength={projectLimits.overview}
          onChange={(value) => set('overview', value)}
          errors={fieldError.localized('overview')}
        />

        <div className="grid gap-space-3">
          <h3 className="text-label text-ink">{t('fields.deliverables')}</h3>
          {draft.deliverables.length === 0 ? (
            <EmptyList>{t('deliverables.empty')}</EmptyList>
          ) : (
            <SortableList
              items={draft.deliverables}
              getId={(row) => row.id}
              getLabel={(row, index) => row.text[locale as 'en' | 'ar'] || t('deliverables.item', { number: index + 1 })}
              onReorder={(next) => setDeliverables(() => next)}
              className="border-t border-line"
              renderItem={(row, index, handle) => (
                <ListRow
                  handle={handle}
                  index={index}
                  className="py-space-3 [&>div:first-child]:pt-space-6 [&>div:last-child]:pt-space-6"
                  removeLabel={t('deliverables.remove', { number: index + 1 })}
                  onRemove={() => setDeliverables((rows) => rows.filter((item) => item.id !== row.id))}
                >
                  <LocalizedField
                    id={`deliverable-${row.id}`}
                    label={t('deliverables.item', { number: index + 1 })}
                    value={row.text}
                    maxLength={projectLimits.deliverable}
                    onChange={(text) => setDeliverables((rows) => rows.map((item) => (item.id === row.id ? { ...item, text } : item)))}
                    errors={fieldError.localized(`deliverables.${index}.text`)}
                  />
                </ListRow>
              )}
            />
          )}
          <AddButton
            label={t('deliverables.add')}
            full={draft.deliverables.length >= projectLimits.deliverables}
            fullNote={t('deliverables.full', { max: projectLimits.deliverables })}
            onClick={() => setDeliverables((rows) => [...rows, { id: newId(), text: { en: '', ar: '' } }])}
          />
          {fieldError.one('deliverables') && <p className="text-small text-danger">{fieldError.one('deliverables')}</p>}
        </div>

        <MarkdownField
          id="project-story"
          label={t('fields.story')}
          hint={t('hints.story')}
          value={draft.story}
          maxLength={projectLimits.story}
          uploadFolder="projects/story"
          onChange={(value) => set('story', value)}
          errors={fieldError.localized('story')}
        />
      </EditorSection>
    </div>
  )
}
