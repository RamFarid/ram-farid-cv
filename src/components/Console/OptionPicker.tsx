'use client'

import { useId, useState, type KeyboardEvent } from 'react'
import { Plus, Search } from 'lucide-react'
import { controlClasses } from '@/components/ui/TextField'
import { cn } from '@/utils'

// Adds one item from a list by typing to filter it: a combobox whose options are the ones not picked yet. ArrowUp and
// ArrowDown move through the matches, Enter adds one, Escape closes the list.
// https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/

export type PickerOption = { id: string; label: string; meta?: string }

type OptionPickerProps = {
  id: string
  label: string
  placeholder: string
  options: PickerOption[]
  onPick: (id: string) => void
  /** Shown when nothing matches the query. */
  noMatch: string
  /** Shown in place of the field once every option is picked or the list is full. */
  disabledNote?: string
}

export function OptionPicker({ id, label, placeholder, options, onPick, noMatch, disabledNote }: OptionPickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const needle = query.trim().toLowerCase()
  const matches = options.filter((option) => !needle || option.label.toLowerCase().includes(needle))
  const current = Math.min(active, matches.length - 1)

  const pick = (option: PickerOption) => {
    onPick(option.id)
    setQuery('')
    setActive(0)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      if (matches.length === 0) return
      setActive((current + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length)
    } else if (event.key === 'Enter' && open && matches[current]) {
      event.preventDefault()
      pick(matches[current])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="grid max-w-measure content-start gap-space-2">
      <label htmlFor={id} className="text-label text-ink">
        {label}
      </label>
      {disabledNote ? (
        <p className="text-small text-ink-muted">{disabledNote}</p>
      ) : (
        <div className="relative">
          <Search
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute start-space-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && matches[current] ? `${listId}-${matches[current].id}` : undefined}
            autoComplete="off"
            value={query}
            placeholder={placeholder}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
            className={cn(controlClasses, 'h-11 ps-9')}
          />
          <ul
            id={listId}
            role="listbox"
            aria-label={label}
            hidden={!open}
            className="absolute inset-x-0 top-full z-30 mt-space-1 grid max-h-72 overflow-y-auto rounded-md border border-line-strong bg-surface p-space-1 shadow-md"
          >
            {matches.map((option, index) => (
              <li
                key={option.id}
                id={`${listId}-${option.id}`}
                role="option"
                aria-selected={index === current}
                // Keeps focus in the input, so the list stays open for the next pick.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(option)}
                onMouseMove={() => setActive(index)}
                className="flex min-h-10 cursor-pointer items-center gap-space-3 rounded-sm px-space-3 text-body text-ink aria-selected:bg-surface-raised"
              >
                <Plus aria-hidden size={16} strokeWidth={1.75} className="shrink-0 text-ink-muted" />
                <span className="min-w-0 flex-1 truncate" dir="auto">
                  {option.label}
                </span>
                {option.meta && <span className="text-small text-ink-muted">{option.meta}</span>}
              </li>
            ))}
            {matches.length === 0 && <li className="px-space-3 py-space-2 text-small text-ink-muted">{noMatch}</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
