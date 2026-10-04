import Image from 'next/image'
import type { ProjectTeaser } from '@/lib/projects/types'
import { cn } from '@/utils'

type ProjectSlabProps = {
  project: Pick<ProjectTeaser, 'title' | 'cover'>
  /** next/image `sizes` for the slab's rendered width. */
  sizes: string
  /** The page's largest image: load it first. */
  eager?: boolean
  className?: string
}

// A project's 16:9 cover on a dark slab, for violet fields (index frames, the next-project band). It keeps the real
// violet ink inside a field. Without a cover it shows the title's monogram, never a stock image.
export function ProjectSlab({ project, sizes, eager, className }: ProjectSlabProps) {
  return (
    <div
      className={cn(
        'relative grid aspect-video place-items-center overflow-hidden rounded-lg border border-violet-ink bg-violet-ink',
        className,
      )}
    >
      {project.cover ? (
        <Image
          src={project.cover.url}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          loading={eager ? 'eager' : undefined}
          fetchPriority={eager ? 'high' : undefined}
          className="object-cover"
        />
      ) : (
        <span aria-hidden className="font-mono text-display text-violet-fill">
          {project.title.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  )
}
