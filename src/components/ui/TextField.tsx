import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/utils'

// See docs/design-system/components/TextField/README.md. The label is always visible; `error` replaces `hint`.
type FieldProps = {
  label: string
  /** Also the control's id unless `id` is given. */
  name: string
  hint?: string
  /** Says what to do: "Enter an email like name@domain.com". */
  error?: string
}

const controlClasses = cn(
  'w-full rounded-md border border-line-strong bg-surface px-space-4 text-body text-ink shadow-sm',
  'transition-colors placeholder:text-ink-muted hover:border-ink-muted focus-visible:border-primary',
  'aria-invalid:border-danger',
)

function FieldShell({
  id,
  label,
  hint,
  error,
  className,
  children,
}: Omit<FieldProps, 'name'> & { id: string; className?: string; children: ReactNode }) {
  const message = error ?? hint

  return (
    <div className={cn('grid gap-space-2', className)}>
      <label htmlFor={id} className="text-label text-ink">
        {label}
      </label>
      {children}
      {message && (
        <p id={`${id}-message`} className={cn('text-small', error ? 'text-danger' : 'text-ink-muted')}>
          {message}
        </p>
      )}
    </div>
  )
}

function describedBy(id: string, hint?: string, error?: string) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || hint ? `${id}-message` : undefined,
  }
}

export function TextField({
  label,
  name,
  hint,
  error,
  id = name,
  className,
  ...props
}: FieldProps & Omit<ComponentProps<'input'>, 'name'>) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <input id={id} name={name} className={cn(controlClasses, 'h-11')} {...describedBy(id, hint, error)} {...props} />
    </FieldShell>
  )
}

// The design system's `multiline` TextField.
export function TextArea({
  label,
  name,
  hint,
  error,
  id = name,
  rows = 5,
  className,
  ...props
}: FieldProps & Omit<ComponentProps<'textarea'>, 'name'>) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        className={cn(controlClasses, 'resize-y py-space-3')}
        {...describedBy(id, hint, error)}
        {...props}
      />
    </FieldShell>
  )
}
