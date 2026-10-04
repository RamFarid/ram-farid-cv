'use client'

import type { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils'

// Shared pieces of the console's ordered lists (services, skill groups, practices, certificates).

/** One ruled row: the grip handle and the row's number on the start side, the fields, then Remove. */
export function ListRow({
  handle,
  index,
  onRemove,
  removeLabel,
  children,
  className,
}: {
  handle: ReactNode
  index: number
  onRemove: () => void
  removeLabel: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-space-3 border-b border-line py-space-5', className)}>
      <div className="grid justify-items-center gap-space-1 pt-space-6">
        {handle}
        <span className="font-mono text-code text-ink-muted tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      {children}
      <div className="pt-space-6">
        <RemoveButton label={removeLabel} onClick={onRemove} />
      </div>
    </div>
  )
}

export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-danger-soft hover:text-danger"
    >
      <Trash2 aria-hidden size={18} strokeWidth={1.75} />
    </button>
  )
}

/** The list's add button, with the reason it's off once the list is full. */
export function AddButton({ label, onClick, full, fullNote }: { label: string; onClick: () => void; full: boolean; fullNote: string }) {
  return (
    <div className="flex flex-wrap items-center gap-space-3">
      <Button variant="secondary" size="sm" icon={<Plus aria-hidden size={18} strokeWidth={1.75} />} disabled={full} onClick={onClick}>
        {label}
      </Button>
      {full && <p className="text-small text-ink-muted">{fullNote}</p>}
    </div>
  )
}

/** What an empty list means for the public page. */
export function EmptyList({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-line-strong px-space-5 py-space-6 text-body text-ink-muted">{children}</p>
}

export const newId = () => crypto.randomUUID()
