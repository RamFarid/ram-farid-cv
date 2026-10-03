'use client'

import 'react-photo-view/dist/react-photo-view.css'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { cn } from '@/utils'

// The full-size certificate viewer (react-photo-view). One provider around the whole gallery, so arrow keys step
// through every certificate; Esc closes. Its chrome is themed in globals.css. See docs/home.md#certifications

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CertificateViewer({ children }: { children: ReactNode }) {
  return (
    <PhotoProvider
      maskOpacity={0.92}
      // The library animates the zoom from the thumbnail; near-instant when motion is reduced.
      speed={() => (reducedMotion() ? 1 : 360)}
      easing={() => 'cubic-bezier(0.2, 0.8, 0.2, 1)'}
      // Each PhotoView's `overlay` (the caption) is only drawn through this.
      overlayRender={({ overlay }) => overlay}
    >
      {children}
    </PhotoProvider>
  )
}

type CertificateThumbProps = {
  image: { src: string; width: number; height: number }
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
      src={image.src}
      width={image.width}
      height={image.height}
      overlay={
        <div
          dir={dir}
          className="absolute inset-x-0 bottom-0 z-20 grid gap-space-1 border-t border-line bg-surface px-space-5 py-space-4 text-start"
        >
          <p className="text-label text-ink">{name}</p>
          <p className="font-mono text-code text-ink-muted">{meta}</p>
        </div>
      }
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
          <Image
            src={image.src}
            alt=""
            fill
            sizes="(min-width: 1200px) 360px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-contain"
          />
        </span>
      </button>
    </PhotoView>
  )
}
