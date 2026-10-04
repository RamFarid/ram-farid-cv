import { Tag } from '@/components/ui/Tag'
import { findStackTool, type StackTool } from '@/lib/projects/stack'
import { cn } from '@/utils'

// A tool's logo in its brand colour (Ram's call, 2026-10-04: the one place the site shows colours beyond violet).
// Dark brand colours draw in the text colour; a tool without a logo gets a two-letter monogram. See docs/portfolio.md#stack

export function StackLogo({ tool, className }: { tool: StackTool; className?: string }) {
  if (!tool.path) {
    return (
      <span
        aria-hidden
        className={cn(
          'inline-flex size-3.5 shrink-0 items-center justify-center font-mono text-[9px] leading-none font-medium',
          className,
        )}
      >
        {tool.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)}
      </span>
    )
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill={tool.color ?? 'currentColor'}
      className={cn('size-3.5 shrink-0', className)}
    >
      <path d={tool.path} />
    </svg>
  )
}

// On a violet field the tag becomes a dark chip (the real violet pair, like the screenshot slab) so brand colours
// stay readable.
const onField = 'in-[.field-violet]:border-transparent in-[.field-violet]:bg-violet-ink in-[.field-violet]:text-violet-fill'

/** A project's tool as a tag with its logo. Ids that aren't in lib/projects/stack.ts show as plain text. */
export function StackTag({ id }: { id: string }) {
  const tool = findStackTool(id)
  if (!tool) return <Tag className={cn('align-top', onField)}>{id}</Tag>

  return (
    // align-top: a monogram's text and an SVG logo give the tag different baselines, which would stagger a row.
    <Tag className={cn('gap-1.5 ps-2 align-top', onField)}>
      <StackLogo tool={tool} />
      {tool.name}
    </Tag>
  )
}
