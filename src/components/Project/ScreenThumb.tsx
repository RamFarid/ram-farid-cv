'use client'

import Image from 'next/image'
import { PhotoView } from 'react-photo-view'
import { PhotoCaption } from '@/components/Reusable/media/PhotoViewer'
import { cn } from '@/utils'

type ScreenThumbProps = {
  image: { url: string; width: number; height: number; alt: string }
  /** Accessible name of the button, e.g. "View screen 3 of 12: <alt>". */
  label: string
  caption?: string
  /** Device and position, e.g. "Phone · 3 / 12". */
  meta: string
  sizes: string
  dir: 'ltr' | 'rtl'
  eager?: boolean
}

// One screenshot in the gallery's justified rows. Its box keeps the image's own ratio, so nothing is cropped and
// nothing shifts while it loads; it opens full size in the PhotoViewer around the gallery.
export function ScreenThumb({ image, label, caption, meta, sizes, dir, eager }: ScreenThumbProps) {
  return (
    <PhotoView
      src={image.url}
      width={image.width}
      height={image.height}
      overlay={<PhotoCaption title={caption} meta={meta} dir={dir} />}
    >
      <button
        type="button"
        aria-label={label}
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        className={cn(
          'relative block w-full cursor-zoom-in overflow-hidden rounded-md border border-line bg-surface-raised',
          'transition-[border-color,box-shadow,translate] duration-(--duration-base) ease-out',
          'hover:-translate-y-0.5 hover:border-primary hover:shadow-glow motion-reduce:hover:translate-y-0',
        )}
      >
        {/* The button's label names it for screen readers; the alt is for image search. */}
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={sizes}
          loading={eager ? 'eager' : undefined}
          fetchPriority={eager ? 'high' : undefined}
          className="object-cover"
        />
      </button>
    </PhotoView>
  )
}
