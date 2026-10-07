'use client'

import 'react-photo-view/dist/react-photo-view.css'
import type { ReactNode } from 'react'
import { PhotoProvider } from 'react-photo-view'

// The site's full-size image viewer (react-photo-view): certificates and project screenshots. One provider around a
// whole set, so arrow keys step through every image in it; Esc closes. Its chrome is themed in globals.css.

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Shared by the provider and by controlled `PhotoSlider`s (the case study's screen stage), so both open alike. */
export const viewerOptions = {
  maskOpacity: 0.92,
  // The library animates the zoom from the thumbnail; near-instant when motion is reduced.
  speed: () => (reducedMotion() ? 1 : 360),
  easing: () => 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  // Each image's `overlay` (the caption) is only drawn through this.
  overlayRender: ({ overlay }: { overlay?: ReactNode }) => overlay,
}

export function PhotoViewer({ children }: { children: ReactNode }) {
  return <PhotoProvider {...viewerOptions}>{children}</PhotoProvider>
}

/** The caption bar drawn over the viewer, in the page's direction. */
export function PhotoCaption({ title, meta, dir }: { title?: string; meta: string; dir: 'ltr' | 'rtl' }) {
  return (
    <div
      dir={dir}
      className="absolute inset-x-0 bottom-0 z-20 grid gap-space-1 border-t border-line bg-surface px-space-5 py-space-4 text-start"
    >
      {title && <p className="text-label text-ink">{title}</p>}
      <p className="font-mono text-code text-ink-muted">{meta}</p>
    </div>
  )
}
