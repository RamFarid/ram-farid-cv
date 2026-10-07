import Image from 'next/image'
import type { PublicProject } from '@/lib/projects/types'
import { cn } from '@/utils'

type ProjectMediaProps = {
  project: PublicProject
  /** `violet`: a deep ink slab on the violet field. */
  tone: 'violet' | 'surface'
  priority?: boolean
  className?: string
}

// The band's 16:9 screenshot. Until a cover exists it shows the title's monogram, never a stock image (design-system README: imagery).
// It isn't a link itself: the band's title link stretches over it, and it lifts when the band is hovered.
export function ProjectMedia({ project, tone, priority, className }: ProjectMediaProps) {
  return (
    <div className={cn('scroll-rise', className)}>
      <div
        className={cn(
          'relative grid aspect-video place-items-center overflow-hidden rounded-lg border',
          'transition-[translate,box-shadow] duration-(--duration-base) ease-out group-hover:-translate-y-0.5 group-hover:shadow-glow motion-reduce:group-hover:translate-y-0',
          tone === 'violet' ? 'border-violet-ink bg-violet-ink' : 'border-line bg-surface-raised',
        )}
      >
        {project.cover ? (
          <Image
            src={project.cover.url}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            sizes="(min-width: 1200px) 560px, (min-width: 1024px) 48vw, 100vw"
            priority={priority}
            className="size-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              'font-mono text-display',
              tone === 'violet' ? 'text-violet-fill' : 'text-line-strong',
            )}
          >
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}
