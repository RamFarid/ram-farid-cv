'use client'

import Image from 'next/image'
import { PhotoView } from 'react-photo-view'
import { PhotoCaption } from '@/components/Reusable/media/PhotoViewer'
import type { HomeImage } from '@/lib/home/types'
import { cn } from '@/utils'

// Certificates open in the shared PhotoViewer, which wraps the whole gallery. See docs/home.md#certifications

type CertificateThumbProps = {
  image: HomeImage
  /** Accessible name of the button, e.g. "View certificate: <name>". */
  label: string
  name: string
  meta: string
  dir: 'ltr' | 'rtl'
}

// The thumbnail that opens the viewer: the whole certificate on a dark mat, never cropped.
export function CertificateThumb({ image, label, name, meta, dir }: CertificateThumbProps) {
  return (
    <PhotoView
      src={image.url}
      width={image.width}
      height={image.height}
      overlay={<PhotoCaption title={name} meta={meta} dir={dir} />}
    >
      <button
        type="button"
        aria-label={label}
        className={cn(
          'group block w-full cursor-zoom-in rounded-lg border border-line bg-surface-raised p-space-3',
          'transition-[border-color,box-shadow,translate] duration-(--duration-base) ease-out',
          'hover:-translate-y-0.5 hover:border-primary hover:shadow-glow motion-reduce:hover:translate-y-0',
        )}
      >
        <span className="relative block aspect-[4/3]">
          {/* The button's label names it for screen readers; the alt is for image search. */}
          <Image
            src={image.url}
            alt={name}
            fill
            sizes="(min-width: 1200px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-contain"
          />
        </span>
      </button>
    </PhotoView>
  )
}
