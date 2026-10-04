'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { ExternalLink, Star, Trash2 } from 'lucide-react'
import { useFormatter, useLocale, useTranslations, type Locale } from 'next-intl'
import { toast } from 'sonner'
import { SortableList } from '@/components/Console/SortableList'
import { Button } from '@/components/ui/Button'
import { Link, useRouter } from '@/i18n/navigation'
import { deleteProjectDraft, reorderProjectList, setProjectPublished, setProjectStar } from '@/lib/projects/actions'
import type { ConsoleProjectRow, ProjectActionResult } from '@/lib/projects/types'
import { missingField } from '@/lib/validations/project'
import { cn } from '@/utils'
import { ProjectStatusBadge } from './ProjectStatusBadge'

// /console/portfolio's list: every project in console order, with the quick actions that save at once (star,
// publish, reorder, delete a draft). Editing happens on each project's own page. See docs/portfolio.md#console

const failed: ProjectActionResult = { ok: false, error: 'unavailable' }

export function ProjectList({ initial }: { initial: ConsoleProjectRow[] }) {
  const t = useTranslations('Console.projects')
  const tProject = useTranslations('Console.project')
  const format = useFormatter()
  const locale = useLocale() as Locale
  const router = useRouter()
  const [rows, setRows] = useState(initial)
  const [previous, setPrevious] = useState(initial)
  const [busy, setBusy] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const reorderTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Fresh rows from the server (after any save) replace the local copy.
  if (initial !== previous) {
    setPrevious(initial)
    setRows(initial)
  }

  useEffect(() => () => clearTimeout(reorderTimer.current), [])

  const titleOf = (row: ConsoleProjectRow) => row.title[locale] || row.title.en || tProject('untitled')

  const missingList = (paths: string[]) => {
    const seen = new Set<string>()
    const labels: string[] = []
    for (const path of paths) {
      const { field, locale: inLocale } = missingField(path)
      const id = `${field}.${inLocale ?? ''}`
      if (seen.has(id)) continue
      seen.add(id)
      const key = `fields.${field}` as 'fields.title'
      const name = tProject.has(key) ? tProject(key) : field
      labels.push(inLocale ? t('inLanguage', { field: name, language: t(`languages.${inLocale}`) }) : name)
    }
    const shown = labels.slice(0, 4)
    if (labels.length > shown.length) shown.push(t('more', { count: labels.length - shown.length }))
    return format.list(shown, { type: 'conjunction' })
  }

  const run = (row: ConsoleProjectRow, action: () => Promise<ProjectActionResult>, success: string, revert?: () => void) => {
    setBusy(row.id)
    startTransition(async () => {
      const result = await action().catch(() => failed)
      setBusy(null)
      if (result.ok) {
        toast.success(success)
        return
      }
      revert?.()
      if (result.error === 'incomplete') {
        toast.error(t('toasts.incomplete', { title: titleOf(row) }), {
          description: missingList(result.missing),
          action: { label: t('toasts.openToFix'), onClick: () => router.push(`/console/portfolio/${row.id}`) },
          duration: 10000,
          actionButtonStyle: { whiteSpace: 'nowrap' },
        })
      } else toast.error(t(`errors.${result.error}`))
    })
  }

  const patch = (id: string, change: Partial<ConsoleProjectRow>) =>
    setRows((list) => list.map((row) => (row.id === id ? { ...row, ...change } : row)))

  const toggleStar = (row: ConsoleProjectRow) => {
    patch(row.id, { starred: !row.starred })
    run(row, () => setProjectStar(row.id, !row.starred), row.starred ? t('toasts.unstarred') : t('toasts.starred'), () =>
      patch(row.id, { starred: row.starred }),
    )
  }

  const togglePublished = (row: ConsoleProjectRow) => {
    const publish = row.status !== 'published'
    run(row, () => setProjectPublished(row.id, publish), publish ? t('toasts.published') : t('toasts.unpublished'))
  }

  const remove = (row: ConsoleProjectRow) => {
    setConfirming(null)
    run(row, async () => {
      const result = await deleteProjectDraft(row.id)
      if (result.ok) setRows((list) => list.filter((item) => item.id !== row.id))
      return result
    }, t('toasts.deleted', { title: titleOf(row) }))
  }

  // Each move is saved once the list settles, so a few quick key presses make one write.
  const commitOrder = (next: ConsoleProjectRow[]) => {
    clearTimeout(reorderTimer.current)
    reorderTimer.current = setTimeout(() => {
      startTransition(async () => {
        const result = await reorderProjectList(next.map((row) => row.id)).catch(() => failed)
        if (result.ok) toast.success(t('toasts.reordered'))
        else {
          setRows(initial)
          toast.error(t(`errors.${result.error === 'incomplete' ? 'unavailable' : result.error}`))
        }
      })
    }, 600)
  }

  return (
    <SortableList
      items={rows}
      getId={(row) => row.id}
      getLabel={titleOf}
      onReorder={setRows}
      onCommit={commitOrder}
      className="border-t border-line"
      renderItem={(row, index, handle) => {
        const title = titleOf(row)
        const kind = row.kind[locale] || row.kind.en
        const isPublished = row.status === 'published'
        const pending = busy === row.id
        return (
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-space-3 gap-y-space-3 border-b border-line py-space-4 md:grid-cols-[auto_auto_minmax(0,1fr)_auto]">
            <div className="flex items-center gap-space-1 md:contents">
              {handle}
              <span dir="ltr" className="w-6 font-mono text-code text-ink-muted tabular-nums md:hidden">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-space-4 md:contents">
              <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-md border border-line bg-surface-raised md:w-32">
                {row.cover ? (
                  <Image src={row.cover.url} alt="" fill unoptimized sizes="8rem" className="object-cover" />
                ) : (
                  <span aria-hidden className="absolute inset-0 grid place-items-center font-mono text-h3 text-ink-muted">
                    {title.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="grid min-w-0 gap-space-1">
                <div className="flex min-w-0 flex-wrap items-center gap-x-space-3 gap-y-space-1">
                  <Link
                    href={`/console/portfolio/${row.id}`}
                    className="min-w-0 truncate text-body font-medium text-ink underline-offset-4 hover:underline"
                  >
                    {title}
                  </Link>
                  <ProjectStatusBadge status={row.status} />
                  {row.starred && (
                    <span className="inline-flex items-center gap-1 text-small text-ink-muted">
                      <Star aria-hidden size={14} strokeWidth={1.75} className="fill-current" />
                      {t('recommended')}
                    </span>
                  )}
                </div>
                <p className="grid min-w-0 font-mono text-code text-ink-muted">
                  <span dir="ltr" className="truncate text-start">/portfolio/{row.slug}</span>
                  {(kind || row.year) && (
                    <span className="truncate">{[kind, row.year].filter(Boolean).join(' · ')}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex flex-wrap items-center gap-space-1 md:col-span-1 md:justify-end">
              <button
                type="button"
                aria-pressed={row.starred}
                disabled={pending}
                onClick={() => toggleStar(row)}
                aria-label={t('star', { title })}
                title={row.starred ? t('unstarHint') : t('starHint')}
                className={cn(
                  'inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-surface-raised disabled:opacity-45',
                  row.starred ? 'text-ink' : 'text-ink-muted hover:text-ink',
                )}
              >
                <Star aria-hidden size={18} strokeWidth={1.75} className={cn(row.starred && 'fill-current')} />
              </button>

              <Button variant="quiet" size="sm" disabled={pending} onClick={() => togglePublished(row)}>
                {isPublished ? t('unpublish') : t('publish')}
              </Button>

              {isPublished ? (
                <a
                  href={`/${locale}/portfolio/${row.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('view', { title })}
                  title={t('viewHint')}
                  className="inline-flex size-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                >
                  <ExternalLink aria-hidden size={18} strokeWidth={1.75} />
                </a>
              ) : confirming === row.id ? (
                <span role="group" aria-label={t('confirmDelete')} className="inline-flex items-center gap-space-1">
                  <span className="px-space-2 text-small text-danger">{t('confirmDelete')}</span>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={pending}
                    className="border-danger text-danger hover:border-danger hover:bg-danger-soft"
                    onClick={() => remove(row)}
                  >
                    {t('delete')}
                  </Button>
                  <Button size="sm" variant="quiet" onClick={() => setConfirming(null)}>
                    {t('cancel')}
                  </Button>
                </span>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setConfirming(row.id)}
                  aria-label={t('deleteLabel', { title })}
                  title={t('deleteHint')}
                  className="inline-flex size-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-45"
                >
                  <Trash2 aria-hidden size={18} strokeWidth={1.75} />
                </button>
              )}

              <Link
                href={`/console/portfolio/${row.id}`}
                className="inline-flex h-9 items-center rounded-md border border-line-strong px-space-4 text-label text-ink transition-colors hover:border-ink-muted hover:bg-surface-raised"
              >
                {t('edit')}
                <span className="sr-only">: {title}</span>
              </Link>
            </div>
          </div>
        )
      }}
    />
  )
}
