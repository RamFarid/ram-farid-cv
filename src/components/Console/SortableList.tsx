'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { GripVertical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/utils'

// An ordered list whose rows move by a grip handle: drag it with a pointer, or focus it and press ArrowUp / ArrowDown.
// In a section, order changes only the draft and Save makes it live; a list that saves at once (the projects index)
// listens to `onCommit`, which fires when a drag ends or a key moves a row. See docs/console.md#lists

type SortableListProps<T> = {
  items: T[]
  getId: (item: T) => string
  /** What the handle and the announcement call the row ("Move New web apps"). */
  getLabel: (item: T, index: number) => string
  onReorder: (items: T[]) => void
  /** The settled order, once per drag or key press. */
  onCommit?: (items: T[]) => void
  renderItem: (item: T, index: number, handle: ReactNode) => ReactNode
  className?: string
}

function move<T>(items: T[], from: number, to: number) {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function SortableList<T>({ items, getId, getLabel, onReorder, onCommit, renderItem, className }: SortableListProps<T>) {
  const t = useTranslations('Console.list')
  const instructionsId = useId()
  const rows = useRef(new Map<string, HTMLLIElement>())
  const handles = useRef(new Map<string, HTMLButtonElement>())
  const drag = useRef<{ id: string; startY: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const refocus = useRef<string | null>(null)

  // Keyboard moves re-render the row in its new place; the handle keeps focus there.
  useEffect(() => {
    if (!refocus.current) return
    handles.current.get(refocus.current)?.focus()
    refocus.current = null
  }, [items])

  const announce = (item: T, to: number) =>
    setAnnouncement(t('moved', { name: getLabel(item, to), position: to + 1, total: items.length }))

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const to = event.key === 'ArrowUp' ? index - 1 : event.key === 'ArrowDown' ? index + 1 : -1
    if (to < 0 || to >= items.length) return
    event.preventDefault()
    const item = items[index]
    const next = move(items, index, to)
    onReorder(next)
    onCommit?.(next)
    announce(item, to)
    refocus.current = getId(item)
  }

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { id, startY: event.clientY, moved: false }
    setDragging(id)
  }

  // While dragging, the row follows the pointer; crossing half of a neighbour swaps them and re-bases the offset.
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const state = drag.current
    if (!state) return
    const index = items.findIndex((item) => getId(item) === state.id)
    let offset = event.clientY - state.startY

    const neighbour = offset > 0 ? items[index + 1] : items[index - 1]
    const neighbourRow = neighbour ? rows.current.get(getId(neighbour)) : undefined
    if (neighbour && neighbourRow && Math.abs(offset) > neighbourRow.offsetHeight / 2) {
      const to = offset > 0 ? index + 1 : index - 1
      const shift = offset > 0 ? neighbourRow.offsetHeight : -neighbourRow.offsetHeight
      state.startY += shift
      state.moved = true
      offset -= shift
      onReorder(move(items, index, to))
      announce(items[index], to)
    }

    const row = rows.current.get(state.id)
    if (row) row.style.translate = `0 ${offset}px`
  }

  const endDrag = () => {
    const state = drag.current
    if (!state) return
    const row = rows.current.get(state.id)
    if (row) row.style.translate = ''
    drag.current = null
    setDragging(null)
    if (state.moved) onCommit?.(items)
  }

  return (
    <>
      <ol className={cn('grid', className)}>
        {items.map((item, index) => {
          const id = getId(item)
          const handle = (
            <button
              type="button"
              ref={(element) => {
                if (element) handles.current.set(id, element)
                else handles.current.delete(id)
              }}
              aria-label={t('move', { name: getLabel(item, index) })}
              aria-describedby={instructionsId}
              onKeyDown={(event) => onKeyDown(event, index)}
              onPointerDown={(event) => onPointerDown(event, id)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="inline-flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink active:cursor-grabbing"
            >
              <GripVertical aria-hidden size={18} strokeWidth={1.75} />
            </button>
          )

          return (
            <li
              key={id}
              ref={(element) => {
                if (element) rows.current.set(id, element)
                else rows.current.delete(id)
              }}
              className={cn(
                'relative bg-bg transition-[box-shadow,background-color] duration-(--duration-fast)',
                dragging === id && 'z-10 bg-surface shadow-md',
              )}
            >
              {renderItem(item, index, handle)}
            </li>
          )
        })}
      </ol>
      <p id={instructionsId} hidden>
        {t('instructions')}
      </p>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  )
}
