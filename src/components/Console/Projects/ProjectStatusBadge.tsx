import { useTranslations } from 'next-intl'
import type { ProjectStatus } from '@/lib/validations/project'
import { cn } from '@/utils'

/** Published (a teal dot: it's on the site) or Draft (only in the console). */
export function ProjectStatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const t = useTranslations('Console.project.status')
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center gap-1.5 rounded-sm border px-1.5 text-small whitespace-nowrap',
        status === 'published' ? 'border-success/40 text-success' : 'border-line text-ink-muted',
        className,
      )}
    >
      {status === 'published' && <span aria-hidden className="size-1.5 rounded-full bg-success" />}
      {t(status)}
    </span>
  )
}
