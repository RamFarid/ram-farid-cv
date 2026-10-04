'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { useRouter } from '@/i18n/navigation'
import { createProjectDraft } from '@/lib/projects/actions'
import { projectLimits } from '@/lib/validations/project'

// New project: the English title is all a draft needs to exist (it makes the slug); everything else is filled in on
// the project's own page, which opens next. See docs/portfolio.md#console
export function NewProject() {
  const t = useTranslations('Console.projects.create')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return setError(t('required'))
    startTransition(async () => {
      const result = await createProjectDraft(title).catch(() => ({ ok: false as const, error: 'unavailable' as const }))
      if (result.ok) router.push(`/console/portfolio/${result.id}`)
      else toast.error(t(`errors.${result.error}`))
    })
  }

  if (!open) {
    return (
      <Button icon={<Plus aria-hidden size={18} strokeWidth={1.75} />} onClick={() => setOpen(true)}>
        {t('open')}
      </Button>
    )
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-wrap items-start gap-space-3 rounded-lg border border-line bg-surface p-space-4 sm:w-auto">
      <TextField
        label={t('title')}
        name="new-project-title"
        hint={t('hint')}
        value={title}
        maxLength={projectLimits.title}
        onChange={(event) => {
          setTitle(event.target.value)
          setError(undefined)
        }}
        error={error}
        autoFocus
        dir="auto"
        className="min-w-0 flex-1 sm:w-80"
      />
      <div className="flex gap-space-2 pt-space-6">
        <Button type="submit" disabled={pending}>
          {t('submit')}
        </Button>
        <Button
          variant="quiet"
          disabled={pending}
          onClick={() => {
            setOpen(false)
            setTitle('')
            setError(undefined)
          }}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  )
}
